var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB();

function putImageDB(key, size) {
  let parts = key.split('/');
  let userId = parts[1];
  let eventDate = parts[2];
  let eventId = parts[3];
  let date = new Date().toISOString();
  var params = {
    TableName: "eeimages",
    Item: {
      path: {
        "S": key
      },
      eventId: {
        S: eventId
      },
      userId: {
        S: userId
      },
      size: {
        N: size.toString()
      },
      eventDate: {
        S: eventDate
      },
      created: {
        S: date
      }
    }
  };
  // Call DynamoDB to add the item to the table
  const putPromise = ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  }).promise();

  var updateParams = {
    TableName: "eemetadata",
    Key: {"key": {S: userId + "-total"}},
    AttributeUpdates: { 'value':  {Value : {N: size.toString()}, Action: 'ADD'}}
  };
  // Call DynamoDB to add the item to the table
  const updatePromise = ddb.updateItem(updateParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  }).promise();

  return Promise.all([putPromise, updatePromise]);

}

exports.handler = async function (event) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const key = event.Records[0].s3.object.key;
  const size = event.Records[0].s3.object.size;
  const eventName = event.Records[0].eventName;
  if (eventName === "ObjectCreated:Put") {
    await putImageDB(key, size);
  }
};