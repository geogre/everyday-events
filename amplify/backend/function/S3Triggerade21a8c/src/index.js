var AWS = require('aws-sdk');
const region = "us-east-1";
const secretName = "prod/eevents/mysql";

AWS.config.update({region: region});


const getSecret = async () => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region: region
  });
  const data = await client.getSecretValue({SecretId: secretName}).promise();
  return JSON.parse(data.SecretString);
}

const mysql = require('mysql2/promise');
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
let secret = null;
let connection = null;

exports.handler = async function (event) {

  if(!secret) secret = await getSecret();
  if(!connection) connection = await mysql.createConnection({
    host     : secret.host,
    user     : secret.username,
    password : secret.password,
    port     : secret.port
  });

  const eventName = event.Records[0].eventName;

  const image = event.Records[0].s3.object;

  const key = image.key;
  const keyParts = image.key.split('/');
  const eventId = keyParts[3];
  const userId = keyParts[1];

  const putObject = {
    TableName: "userprofile-dev",
    Key: {
      userId: userId,
    },
    ExpressionAttributeValues: null,
    UpdateExpression: "ADD imagescount :count, imagessize :size"
  };

  if (eventName === "ObjectCreated:Put") {
    const size = image.size;
    putObject.ExpressionAttributeValues = { ":count": 1, ":size": size };
    await docClient.update(putObject).promise();
    await connection.execute("INSERT INTO everydayeventsdb.eimages (`eventId`, `size`, `path`) VALUES (?, ?, ?)", [eventId, size, key]);
  } else if (eventName === "ObjectRemoved:Delete") {
    const size = keyParts[4].split('-')[0];
    if (Number.isInteger(Number(size))) {
      putObject.ExpressionAttributeValues = { ":count": -1, ":size": -1 * size };
      await docClient.update(putObject).promise();
      await connection.execute("DELETE FROM everydayeventsdb.eimages WHERE path = ?", [image.key]);
    }
  }
};