import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import


export const handler = async(event) => {
	const client = new S3Client({"region":"us-east-1"});
	const input = { // GetObjectRequest
		Bucket: "arn:aws:s3-object-lambda:us-east-1:995789409065:accesspoint/ee-thumbnail-olap", // required
		//Bucket: "arn:aws:s3::995789409065:ee-aws-bucket173627-dev",
		Key: "public/bestgeogre/2022-10-23/2022-10-23-Karpati-den-2/20221023_121910.jpg", // required
	};
	let body = "No results";
	let isBase64Encoded =false;
	const command = new GetObjectCommand(input);
	try {
		const result = await client.send(command);
		body = await result.Body.transformToString("base64");
		console.log('DONE');
		isBase64Encoded = true;
	} catch (error) {
		console.log('ERROR', error);
		body = error;
	}
	const response = {
		statusCode: 200,
		headers: {"content-type": "image/jpeg"},
		isBase64Encoded: isBase64Encoded,
		body: body
		//body: event.queryStringParameters.key
	};
	return response;
};