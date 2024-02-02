// app.js

const express = require('express');
const path = require('path');
const aws = require('aws-sdk');
const { write } = require('fs');

const app = express();
const port = 3000;

//aws settings
const S3_BUCKET_NAME = process.env.S3_BUCKET;
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});
const s3 = new aws.S3();

//helper functions s3
function readDataFromS3() {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: 'data.json',
  };

  return s3
    .getObject(params)
    .promise()
    .then((data) => JSON.parse(data.Body.toString()))
    .catch((error) => {
      console.error('Error reading data from S3:', error);
      return undefined;
    });
}

// Function to write data to the S3 bucket
function writeDataToS3(data) {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: 'data.json',
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  };

  return s3
    .putObject(params)
    .promise()
    .then(() => console.log('Data written to S3'))
    .catch((error) =>
      console.error('Error writing data to S3:', error)
    );
}

// Serve static files (including the HTML file)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

let mockData = [
  { time: 10, playerName: 'ABC' },
  { time: 25, playerName: 'XYZ' },
  { time: 15, playerName: 'DEF' },
  { time: 5, playerName: 'GHI' },
]; // Assuming data is an array of objects { time, playerName }

//TODO:  When deploying, you should change the ‘AllowedOrigin’ to only accept requests from your domain.
app.post('/leaderboard', (req, res) => {
  const isLocal = false;
  let data = isLocal ? mockData : readDataFromS3();
  const { time, playerName } = req.body;

  data.push({ time, playerName });
  data.sort((a, b) => a.time - b.time);

  writeDataToS3(data);

  res.json(data);
});

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
