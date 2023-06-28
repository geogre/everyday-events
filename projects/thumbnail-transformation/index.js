const AWS = require("@aws-sdk/client-s3");
const s3 = new AWS.S3({ region: "us-east-1" });

const fs = require('fs');

async function run() {
	const key = '20230318_143838.jpg';
	const original = await (await s3.getObject({
		Bucket: 'test-fucking-object-access-lambda',
		Key: key
	})).Body.transformToByteArray();

	fs.writeFileSync(`output/original_image.jpg`, original);

	const thumbnail = await (await s3.getObject({
		Bucket: 'test-how-it-works-arma371x7o8ur6q5skkbjxfcuse1a--ol-s3',
		Key: key
	})).Body.transformToByteArray();

	fs.writeFileSync(`output/thumbnail_image.jpg`, thumbnail);
}
run().catch((error) => {
	console.error(error);
	process.exit(1);
});