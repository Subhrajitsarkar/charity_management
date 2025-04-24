// services/S3services.js
require('dotenv').config();
const AWS = require('aws-sdk');

//data: The file content (such as CSV data).
// filename: The name of the file to be stored in S3.
const uploadToS3 = async (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        region: 'us-east-1'
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,// The file name
        Body: data,// The actual file data to upload.
        ACL: 'public-read',// The file will be publicly accessible.
        ContentType: 'text/csv'
    };

    try {
        //.promise() ensures the function is async/await compatible.
        const s3response = await s3bucket.upload(params).promise();
        console.log('File uploaded successfully:', s3response.Location);
        return s3response.Location;
    } catch (err) {
        console.log('Error uploading to S3:', err);
        throw err;
    }
};

module.exports = { uploadToS3 };
