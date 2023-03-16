const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage();

// Configure an instance of multer 
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 15 * 1024 * 1024
    }
  });

// Configure our uploads bucket 
const bucket = storage.bucket('photomapper-jessymac-uploads');

// Middleware
app.use('./js', express.static(__dirname + '/public/js'));
app.use('./css', express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/upload', multer.single('file'), (req, res, next) => {
    console.log(req.file);
  
    // Check if there is a file
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }
  
    // Create a "landing place" for the file in GCS
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();
  
    blobStream.on('finish', () => {
      const uploadedFile = `${bucket.name}/${blob.name}`;
      console.log(`File uploaded: ${uploadedFile}`);
      res.redirect('/');
    });
  
    // Close the landing place
    blobStream.end(req.file.buffer);
  
});

app.listen(port, () => {
    console.log(`PhotoMapper Web App listening on port ${port}`);
});