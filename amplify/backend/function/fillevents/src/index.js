/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
const region = "us-east-1";
const secretName = "prod/eevents/mysql";

AWS.config.update({region: region});



const scanTable = async () => {
    const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    const params = {
        TableName: 'impressions',
        ProjectionExpression: "eventId, userId, eventDate, title"
    };

    let scanResults = [];
    let items = [];
    do {
        items = await ddb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    return scanResults;
};

const getSecret = async () => {
    // Create a Secrets Manager client
    const client = new AWS.SecretsManager({
        region: region
    });
    const data = await client.getSecretValue({SecretId: secretName}).promise();
    return JSON.parse(data.SecretString);
}

const mysql = require('mysql2/promise');
// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
exports.handler = async (event, context) => {

    const secret = await getSecret();
    const items = await scanTable();
    console.log(items.length);

    const connection = await mysql.createConnection({
        host     : secret.host,
        user     : secret.username,
        password : secret.password,
        port     : secret.port
    });

    await connection.execute("TRUNCATE TABLE everydayeventsdb.eevents");

    for(const item of items) {
        if (item?.userId?.S && item?.eventId?.S && item?.title?.S && item?.eventDate?.S) {
            await connection.execute("INSERT INTO everydayeventsdb.eevents (`userId`, `eventId`, `title`, `eventDate`) VALUES (?, ?, ?, ?)", [item.userId.S, item.eventId.S, item.title.S, item.eventDate.S]);
        }
    };
};