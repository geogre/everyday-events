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

const s3 = new AWS.S3({apiVersion: '2006-03-01'});


const getSecret = async () => {
    // Create a Secrets Manager client
    const client = new AWS.SecretsManager({
        region: region
    });
    const data = await client.getSecretValue({SecretId: secretName}).promise();
    return JSON.parse(data.SecretString);
}

async function* listAll(opts) {
    opts = { ...opts };
    do {
        const data = await s3.listObjectsV2(opts).promise();
        opts.ContinuationToken = data.NextContinuationToken;
        yield data;
    } while (opts.ContinuationToken);
}

const listBucket = async () => {
    const bucketParams = {
        Bucket : 'ee-aws-bucket173627-dev'
    };

    let allImages = [];

    for await (const data of listAll(bucketParams)) {
        data.Contents.forEach(img => allImages.push(img));
    }

    return allImages;
}

const mysql = require('mysql2/promise');
// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
exports.handler = async (event, context) => {

    const secret = await getSecret();
    const images = await listBucket();
    const connection = await mysql.createConnection({
        host     : secret.host,
        user     : secret.username,
        password : secret.password,
        port     : secret.port
    });

    await connection.execute("TRUNCATE TABLE everydayeventsdb.eimages");

    for(const img of images) {
        const eventId = img.Key.split('/')[3];
        const size = img.Size;
        const path = img.Key;
        await connection.execute("INSERT INTO everydayeventsdb.eimages (`eventId`, `size`, `path`) VALUES (?, ?, ?)", [eventId, size, path]);
    }
};