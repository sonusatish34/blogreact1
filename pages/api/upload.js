// pages/api/upload.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false, // Disable the built-in body parser to handle file uploads manually
  },
};

const s3 = new S3Client({
  region: 'blr1', // Region of your DigitalOcean Space
  endpoint: 'https://blr1.digitaloceanspaces.com', // DigitalOcean Space endpoint
  credentials: {
    accessKeyId: "DO00EMW9VPKGYFANMCYQ", // Access key
    secretAccessKey: "y+1iUnpYYwGZM0mq4O+vQEEWaNffAkKLKNQY9Y48IXQ", // Secret key
  },
});

const uploadFileToSpace = async (file) => {
  const fileStream = fs.createReadStream(file.filepath);

  const uploadParams = {
    Bucket: 'ldcars',  // Your Space name
    Key: file.originalFilename, // The file name you want to save as (or generate a unique name)
    Body: fileStream,
    // ContentType: req.file.mimetype,  // Mime type of the uploaded file
    // ACL: 'public-read',  // Make file publicly accessible
  };

  const command = new PutObjectCommand(uploadParams);

  try {
    await s3.send(command);
  } catch (error) {
    throw new Error('Failed to upload file to DigitalOcean Spaces');
  }
};

export default function handler(req, res) {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the file' });
      return;
    }

    const file = files.file[0];

    try {
      await uploadFileToSpace(file); // Upload to DigitalOcean Space
      res.status(200).json({ message: 'File uploaded successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
