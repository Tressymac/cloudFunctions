 // Requires 
const {Storage} = require('@google-cloud/storage');
const {Firestore} = require('@google-cloud/firestore');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const getExif = require('exif-async');
const parseDMS = require('parse-dms');


// Variables
const storage = new Storage();
const firestore = new Firestore();
const bucketName = '41200_photomapper';
// const fileName = 'IMG_1883.jpeg'; // Indianapolis photo no location data
const fileName = 'IMG_4580.jpeg'; // Taj photo with location data


// My "main"/entrypoint function
const extractExif = async () => {
    // Create a variable that points to the object in GCS
    photoFile = storage.bucket(bucketName).file(fileName);

    // Creating a working driectory on pur VM to download the original fie 
    // The value of this virable will be something like ".../temp/exif"
    const workingDir = path.join(os.tmpdir(), 'exif');
    console.log(`Working ${workingDir}`);

    // Create a virable that holds a path to the local verison of the file
    const tmpFilePath = path.join(workingDir, photoFile.name);
    console.log(`TmpFilepath: ${tmpFilePath}`);

    // Wait untill the working dir is ready
    await fs.ensureDir(workingDir);
    console.log("Working directory is ready");

    // Download the original file to the path on local VM
    await storage.bucket(bucketName).file(fileName).download({
        destination: tmpFilePath        
    }, async (err, file, apiResponse)  => {
        // This stuff happens after the file is downloaded locally
        console.log(`File downloaded: ${tmpFilePath}`);

        // pass the local to our readExifData function 
        const coordinates = await readExifData(tmpFilePath);
        // console.log(coordinates);

        // Pass the GCS object to the helper function
        // This does not read teh data in the file
        // readMetadata(photoFile);

        // Write some locations data to firestore
        let collectionRef = firestore.collection('photos');
        let documentRef = await collectionRef.add(coordinates);
        console.log(`Document created: ${documentRef}`);

        // Delete the local version of the file 
        await fs.remove(workingDir);
    }); 
};

// Call the entrypoint function 
// This is not needed in the google cloud function 
extractExif();

// Helper functions 
async function readMetadata(gcsFile) {
    const [metadata] = await gcsFile.getMetadata();
    console.log(metadata);
};

async function readExifData(localFile){
// Use the exif-async package to read the exif data
let exifData;
try{
    exifData = await getExif(localFile);
    console.log(exifData.gps);

    if (Object.keys(exifData.gps).length > 0){
       let gpsInDecimal = getGPSCoords(exifData.gps);
       console.log(gpsInDecimal);
       console.log(`Lat: ${gpsInDecimal.lat}`);
       console.log(`Lon: ${gpsInDecimal.lon}`);
       // Return the lat/lon object
       return gpsInDecimal;
    } else{
        console.log("No gps data was found in this photo");
        return null;
    }

}catch(err){
    console.log(err);
    return null; 
}

}

function getGPSCoords(g){
    // Parse DMS needs a string in the format of: 
    // DEGREE:MIN:SECDERICTION DEG:MIN:SECDERICTION
    // const g = exifData.gps
    const latString = `${g.GPSLatitude[0]}:${g.GPSLatitude[1]}:${g.GPSLatitude[2]}${g.GPSLatitudeRef}`;
    const lonString = `${g.GPSLongitude[0]}:${g.GPSLongitude[1]}:${g.GPSLongitude[2]}${g.GPSLongitudeRef}`;
    
    // console.log(`${latString} ${lonString}`);

    degCoords = parseDMS(`${latString} ${lonString}`);
    return degCoords;
    // console.log(degCoords);
}