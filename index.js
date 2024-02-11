const express = require('express');
const path = require('path');
const aws = require('aws-sdk');
const {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} = require('obscenity');

const app = express();
app.use(cors());
const port = 3000;

// aws settings
const S3_BUCKET_NAME = process.env.S3_BUCKET;
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});
const s3 = new aws.S3();

// Helper function to read data from S3
async function readDataFromS3() {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
  const key = `${today}-data.json`;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
  } catch (error) {
    console.error('Error reading data from S3:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

// Function to write data to the S3 bucket
async function writeDataToS3(data) {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
  const key = `${today}-data.json`;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  };

  try {
    await s3.putObject(params).promise();
    console.log('Data written to S3');
  } catch (error) {
    console.error('Error writing data to S3:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

async function didObjectExist() {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
  const key = `${today}-data.json`;
  try {
    // Check if the object exists
    await s3
      .headObject({ Bucket: S3_BUCKET_NAME, Key: key })
      .promise();

    // Object exists, send response
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      // Object doesn't exist, create it with an initial JSON body of []
      const initialData = [];
      await s3
        .putObject({
          Bucket: S3_BUCKET_NAME,
          Key: key,
          Body: JSON.stringify(initialData),
          ContentType: 'application/json',
        })
        .promise();
      return false;
    } else {
      // Unexpected error
      console.error('Error:', error);
      return false;
    }
  }
}

// Serve static files (including the HTML file)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set Content-Type for JavaScript files
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.use(express.json());

let mockData = [
  { time: 10, playerName: 'ABC' },
  { time: 25, playerName: 'XYZ' },
  { time: 15, playerName: 'DEF' },
  { time: 5, playerName: 'GHI' },
]; // Assuming data is an array of objects { time, playerName }

//TODO:  When deploying, you should change the ‘AllowedOrigin’ to only accept requests from your domain.
app.post('/leaderboard', async (req, res) => {
  try {
    const didObjectExistResult = await didObjectExist();
    console.info('s3 object existed?', didObjectExistResult);
    const isLocal = false;
    let data = isLocal ? mockData : await readDataFromS3();

    const { time, playerName, playerID } = req.body;
    console.log(data);

    const matcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });

    const nameIsProfane = matcher.hasMatch(playerName);

    if (nameIsProfane) {
      data.push({ time, playerName: '***', playerID });
    } else {
      data.push({ time, playerName, playerID });
    }

    data.sort((a, b) => a.time - b.time);

    if (!isLocal) {
      writeDataToS3(data);
    }

    res.json(data);
  } catch (e) {
    console.error(e);
  }
});

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
