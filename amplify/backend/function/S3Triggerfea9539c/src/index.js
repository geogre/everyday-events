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

exports.handler = async function (event) {

  const secret = await getSecret();
  const connection = await mysql.createConnection({
    host     : secret.host,
    user     : secret.username,
    password : secret.password,
    port     : secret.port
  });

  const eventName = event.Records[0].eventName;

  const image = event.Records[0].s3.object;
  if (eventName === "ObjectCreated:Put") {
    const key = image.key;
    const size = image.size;
    const eventId = image.key.split('/')[3];

    await connection.execute("INSERT INTO everydayeventsdb.eimages (`eventId`, `size`, `path`) VALUES (?, ?, ?)", [eventId, size, key]);
  } else if (eventName === "ObjectRemoved:Delete") {
    await connection.execute("DELETE FROM everydayeventsdb.eimages WHERE path = ?", [image.key]);
  }
};