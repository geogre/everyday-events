const AWS = require('aws-sdk');
// Set the region
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


exports.handler = async (event, context) => {


	const secret = await getSecret();
	const connection = await mysql.createConnection({
		host     : secret.host,
		user     : secret.username,
		password : secret.password,
		port     : secret.port
	});

	for (const record of event.Records) {
		if (record.eventName === 'INSERT') {
			const item = record.dynamodb.NewImage;
			const isPrivate = item.isPrivate.BOOL;
			if (!isPrivate) {
				await connection.execute("INSERT INTO everydayeventsdb.eevents (`userId`, `eventId`, `title`, `eventDate`) VALUES (?, ?, ?, ?)", [item.userId.S, item.eventId.S, item.title.S, item.eventDate.S]);
			}
		} else if (record.eventName === 'MODIFY') {
			const item = record.dynamodb.NewImage;
			const keys = record.dynamodb.Keys;
			const isPrivate = item.isPrivate.BOOL;
			if (isPrivate) {
				await connection.execute("DELETE FROM everydayeventsdb.eevents WHERE userId = ? AND eventId = ?", [keys.userId.S, keys.eventId.S]);
			} else {
				await connection.execute("INSERT INTO everydayeventsdb.eevents (`userId`, `eventId`, `title`, `eventDate`) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `title` = ?, `eventDate` = ?", [item.userId.S, item.eventId.S, item.title.S, item.eventDate.S, item.title.S, item.eventDate.S]);
			}
		} else if (record.eventName === 'REMOVE') {
			const keys = record.dynamodb.Keys;
			await connection.execute("DELETE FROM everydayeventsdb.eevents WHERE userId = ? AND eventId = ?", [keys.userId.S, keys.eventId.S]);
		}
		console.log(record.eventID);
		console.log(record.eventName);
		console.log('DynamoDB Record: %j', record.dynamodb);
	}
	return `Successfully processed ${event.Records.length} records.`;
};
