import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import

const olapBucket = "arn:aws:s3-object-lambda:us-east-1:995789409065:accesspoint/ee-thumbnail-olap";
const thumbnailBucket = "arn:aws:s3:us-east-1:995789409065:accesspoint/thumbnails-ap";

export const handler = async(event) => {
	const key = event.queryStringParameters.key;
	let isThumbnailExist = false;
	let body = 'No results';
	let isBase64Encoded =false;

	const client = new S3Client({"region":"us-east-1"});
	// Try to read thumbnails first
	const inputThumbnail = { // GetObjectRequest
		Bucket: thumbnailBucket, // required
		Key: key,
	};
	const commandThumbnail = new GetObjectCommand(inputThumbnail);
	try {
		const result = await client.send(commandThumbnail);
		body = await result.Body.transformToString("base64");
		isBase64Encoded = true;
		isThumbnailExist = true;
	} catch (error) {
		console.log('THUMBNAIL ERROR', error);
	}

	if (!isThumbnailExist) {
		const inputOlap = { // GetObjectRequest
			Bucket: olapBucket, // required
			//Bucket: "arn:aws:s3::995789409065:ee-aws-bucket173627-dev",
			Key: key,
		};
		const commandOlap = new GetObjectCommand(inputOlap);
		try {
			const result = await client.send(commandOlap);
			body = await result.Body.transformToString("base64");
			isBase64Encoded = true;

			const putCommand = new PutObjectCommand({
				Bucket: thumbnailBucket,
				Key: key,
				Body: result.Body
			});

			try {
				const response = await client.send(putCommand);
				console.log(response);
			} catch (err) {
				console.error("PUT OBJECT ERROR", err);
			}
		} catch (error) {
			console.log('ERROR OLAP', error);
			body = error;
		}


	}

	const response = {
		statusCode: 200,
		headers: {"content-type": "image/jpeg"},
		isBase64Encoded: isBase64Encoded,
		body: body
	};
	return response;
};
