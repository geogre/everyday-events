/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk');
const secretName = "prod/eevents/mysql";
const region = "us-east-1";

const getSecret = async () => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region: region
  });
  const data = await client.getSecretValue({SecretId: secretName}).promise();
  return JSON.parse(data.SecretString);
}

const mysql = require('mysql2/promise');

const getConnection = async () => {
  const secret = await getSecret();
  const connection = await mysql.createConnection({
    host     : secret.host,
    user     : secret.username,
    password : secret.password,
    port     : secret.port
  });
  return connection;
}

const getLastDayOfMonth = (year, month) => {
  return 31;
}

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Check for required userId
app.use(function(req, res, next) {
  if(req.query.hasOwnProperty('userId')) {
    next()
  } else {
    res.status(400)
    res.send('Required query parameter userId is missed')
  }
});

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/**********************
 * Example get method *
 **********************/

app.get('/all', async function(req, res) {
  const connection = await getConnection();
  const selectString = `SELECT YEAR(ee.eventDate) AS eventsYear, COUNT(DISTINCT ee.eventId) AS eventsCount, COUNT(ei.eventId) AS imagesCount
                        FROM everydayeventsdb.eevents ee
                        JOIN everydayeventsdb.eimages ei ON ei.eventId = ee.eventId
                        WHERE userId = ? GROUP BY eventsYear`;
  const params = [req.query.userId];
  const [rows, fields] = await connection.execute(selectString, params);
  res.json({success: true, rows: rows});
});

app.get('/year', async function(req, res) {
  const connection = await getConnection();
  const year = req.query.year;
  const selectString = `SELECT MONTH(ee.eventDate) AS eventsMonth, COUNT(DISTINCT ee.eventId) AS eventsCount, COUNT(ei.eventId) AS imagesCount
                        FROM everydayeventsdb.eevents ee
                        JOIN everydayeventsdb.eimages ei ON ei.eventId = ee.eventId
                        WHERE userId = ? AND ee.eventDate >= '${year}-01-01' AND ee.eventDate <= '${year}-12-31' GROUP BY eventsMonth`;
  const params = [req.query.userId];
  const [rows, fields] = await connection.execute(selectString, params);
  res.json({success: true, rows: rows});
});

app.get('/month', async function(req, res) {
  const connection = await getConnection();
  const year = req.query.year;
  const month = req.query.month;
  const lastDayOfMonth = getLastDayOfMonth(year, month);
  const selectString = `SELECT DAY(ee.eventDate) AS eventsDay, COUNT(DISTINCT ee.eventId) AS eventsCount, COUNT(ei.eventId) AS imagesCount
                        FROM everydayeventsdb.eevents ee
                        JOIN everydayeventsdb.eimages ei ON ei.eventId = ee.eventId
                        WHERE userId = ? AND ee.eventDate >= '${year}-${month}-01' AND ee.eventDate <= '${year}-${month}-${lastDayOfMonth}' GROUP BY eventsDay`;
  const params = [req.query.userId];
  const [rows, fields] = await connection.execute(selectString, params);
  res.json({success: true, rows: rows});
});

app.get('/day', async function(req, res) {
  const connection = await getConnection();
  const year = req.query.year;
  const month = req.query.month;
  const day = req.query.day;
  const selectString = `SELECT ee.title AS eventName, ee.eventId as eventPath, COUNT(ei.eventId) AS imagesCount
                        FROM everydayeventsdb.eevents ee
                        JOIN everydayeventsdb.eimages ei ON ei.eventId = ee.eventId
                        WHERE userId = ? AND ee.eventDate = '${year}-${month}-${day}' GROUP BY eventName, eventPath`;
  const params = [req.query.userId];
  const [rows, fields] = await connection.execute(selectString, params);
  res.json({success: true, rows: rows});
});


app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
