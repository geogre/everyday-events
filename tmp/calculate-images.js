/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
// AWS.config.update({region: 'us-east-1'});

// Load the AWS SDK
const region = "us-east-1";
const secretName = "prod/eevents/mysql";
let secret;
let decodedBinarySecret;

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
    region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.
// // Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
// //const ddb = new AWS.DynamoDB();
const mysql = require('mysql');

//
// getEventIndexId = eventId => {
//     connection.query('');
// }
//
// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
exports.handler = (event, context) => {
//    context.callbackWaitsForEmptyEventLoop = false; 
// // Create the parameters for calling listObjects
    client.getSecretValue({SecretId: secretName}, function(err, data) {
        if (err) {
            console.log(err);
            if (err.code === 'DecryptionFailureException')
                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InternalServiceErrorException')
                // An error occurred on the server side.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InvalidParameterException')
                // You provided an invalid value for a parameter.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InvalidRequestException')
                // You provided a parameter value that is not valid for the current state of the resource.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'ResourceNotFoundException')
                // We can't find the resource that you asked for.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
        }
        else {
            // Decrypts secret using the associated KMS key.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = JSON.parse(data.SecretString);
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
            }
            console.log('secret', secret);
            const connection = mysql.createConnection({
                host     : secret.host,//'everydayeventsdb.ceskgz13anye.us-east-1.rds.amazonaws.com',
                user     : secret.username,//'admin',
                password : secret.password,//'mynamegeO#67',
                port     : secret.port//3306
            });
            
            // console.log('secret', secret);
            
            connection.connect(function(err) {
            if (err) console.log('Connection error', err);
              connection.query("INSERT INTO everydayeventsdb.eevents (`id`, `userId`, `eventId`, `eventName`, `date`, `isPrivate`) VALUES ('5', 'user', 'event5', 'Some new name 5', '2022-07-28', '1');", function (err, result, fields) {
                if (err) console.log('Query error', err);
                console.log(result);
                context.succeed();
              });
            
            console.log('Success');
            });
        }

        console.log('test');
    });
//};
//
//
// var bucketParams = {
//     Bucket : 'ee-aws-bucket173627-dev',
//     MaxKeys: 5
// };
// Call S3 to obtain a list of the objects in the bucket
    // s3.listObjects(bucketParams, function(err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     } else {
    //         const result = data.Contents.forEach(img => {
    //             const eventId = img.Key.split('/')[2];
    //             const size = img.Size;
    //             const path = img.Key;

    //         }, []);
    //         console.log("Result", result);

    //         // result.forEach(element => {
    //         //     var params = {
    //         //         TableName: "eemetadata",
    //         //         Key: {"key": {S: element.name + "-total"}},
    //         //         AttributeUpdates: { 'value':  {Value : {N: element.val.toString()}, Action: 'ADD'}}
    //         //     };
    //         //     console.log("Params", params);
    //         //     // Call DynamoDB to add the item to the table
    //         //     ddb.updateItem(params, function (err, data) {
    //         //         if (err) {
    //         //             console.log("Error", err);
    //         //         } else {
    //         //             console.log("Success", data);
    //         //         }
    //         //     });
    //         // });
    //     }
    // });
};

