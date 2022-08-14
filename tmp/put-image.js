function putImageDB(key, size) {
	let parts = key.split('/');
	let userId = parts[1];
	let eventDate = parts[2];
	let eventId = parts[3];
	let date = new Date().toISOString();
	var params = {
		TableName: "eeimages",
		Key: {"path": {S: key}, "eventId": {S: eventId}},
		AttributeUpdates: { 'size':  {Value : {N: size.toString()}, Action: 'ADD'}}
	};
	// Call DynamoDB to add the item to the table
	return ddb.updateItem(params, function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log("Success", data);
		}
	}).promise();
}