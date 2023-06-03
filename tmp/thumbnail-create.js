const AWS = require("aws-sdk");
const sharp = require("sharp");
const axios = require("axios");

exports.handler = async (event) => {
	// extract from the event context the following:
	// - outputRoute and outputToken which we'll need to send back the modified object
	// - inputS3Url, which we'll need to get original object from the bucket
	const {outputRoute, outputToken, inputS3Url} = event.getObjectContext || {};

	// Get original image from S3 with help of inputS3Url parameter
	// we are retriving the image, that's why setting responseType to 'arraybuffer'
	const { data : originalImage } = await axios.get(inputS3Url, {
		responseType: 'arraybuffer'
	});

	// Resise the original image and convert the result to buffer
	const thumbnail = await sharp(originalImage)
		.resize({ width: 320, height: 320, fit: "inside" })
		.toBuffer();

	//Construct the client
	const client = new AWS.S3({ region: "us-east-1" });

	const params = {
		RequestRoute: outputRoute,
		RequestToken: outputToken,
		Body: thumbnail
	};

	// send the transformed object
	await client.writeGetObjectResponse(params).promise();

	return {
		statusCode: 200
	};
};