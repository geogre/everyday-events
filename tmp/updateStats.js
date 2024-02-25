const region = "us-east-1";

import { DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";

let dbclient = null;

export const handler = async (event) => {

    if(!dbclient)  dbclient = new DynamoDBClient({ region: region});

    const eventName = event.Records[0].eventName;
    const image = event.Records[0].s3.object;
    const size = image.size;
    const userId = image.key.split('/')[1];

    const putObject = {
        TableName: "userprofile-dev",
        Key: {
            userId: { S: userId },
        },
        ExpressionAttributeValues: null,
        UpdateExpression: "ADD imagescount :count, imagessize :size"
    };

    if (eventName === "ObjectCreated:Put") {
        putObject.ExpressionAttributeValues = { ":count": {N: "1"}, ":size": {N: "1000"} };
        const command = new UpdateItemCommand(putObject);
        const response = await dbclient.send(command);
        console.log(response);
        return response;
    } else if (eventName === "ObjectRemoved:Delete") {
        putObject.ExpressionAttributeValues = { ":count": {N: "-1"}, ":size": {N: "-" + size} };
        const command = new UpdateItemCommand(putObject);
        const response = await dbclient.send(command);
        console.log(response);
        return response;
    }
};