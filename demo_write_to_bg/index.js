const csv = require('csv-parser');
const fs = require('fs');
const {Storage} = require('@google-cloud/storage');
const {BigQuery} = require('@google-cloud/bigquery');

const bq = new BigQuery();
const dataSetId = 'weather_etl';
const tableId = 'observations';

// write a function that opens and reads the CSV file 
const readAndWriteFile = (file, context) => {
    // console.log('Hello world');
    // let dataFile = '724380-93819.0.csv';
    
    
    // const gcs = new BigQuery();
    // const dataFile = gcs.bucket(file.bucket).file(file.name);
    const gcs = new Storage();
    const dataFile = gcs.bucket(file.bucket).file(file.name);

    
    fs.createReadStream(dataFile)
    .pipe(csv())
    .on('data', (observation) => { 
        // console.log(observation)
        // console.log(parseInt(observation.year));  
        // observation.year = parseInt(observation.year);
        // console.log(observation)
        transformObjects(observation);

        // Temp temp temp create an object to write BigQuery
        fakeObservation = {};
        fakeObservation.year = 2023;
        console.log(fakeObservation);
        writeToBq(observation);
    });
}; 

// Call that "Main" function
readAndWriteFile();

// Helper function 
function transformObjects(obs){
    // The .map() function will let us examine each element of the object one at a time 
    // "key" is the name of the key (i.e, "airtemp")
    // "obs[key]" is the value of the element named in "key"

    Object.keys(obs).map((key) => {
        console.log(`Key: ${key} value: ${obs[key]}`);

        // Write code here to examine each object and transform if nessary
        // elements with value of -999 should be set to "null"
        if (key == "station"){
            obs[key] = name;
            console.log(`this is the name ${obs[key]}`)
        }        
        if (obs.year){
            obs.year = parseInt(obs.year);
        }
        if (obs.month){
            obs.month = parseInt(obs.month);
        }
        if (obs.day){
            obs.day = parseInt(obs.day);
        }
        if (obs.hour){
            obs.hour = parseInt(obs.hour);
        }
        if (obs.winddirection){
            obs.winddirection = parseFloat(obs.winddirection);
        }
        if (obs.sky){
            obs.sky = parseInt(obs.sky);
        }
        if (obs.precip1hour = "-9999.0"){
            changedToNull = null;
            obs.precip1hour = parseInt(changedToNull); 
        }
        if (obs.precip6hour = "-9999.0"){
            changedToNull = null; 
            obs.precip6hour = parseInt(changedToNull);
        }
        if (obs.airtemp){
            divided = obs.airtemp/10;
            obs.airtemp = parseFloat(divided);
        }
        if (obs.dewpoint){
            divided = obs.dewpoint/10;
            obs.dewpoint = parseFloat(divided);
        }
        if (obs.pressure){
            divided = obs.pressure; 
            obs.pressure = parseFloat(divided);
        }
        if (obs.windspeed){
            divided = obs.windspeed/10;
            obs.windspeed = parseFloat(divided);
        }
        // Year, Month, Day, Hours< windDirection, Sky should be int
        // Airtemp, DewPoint, Pressure, WindSpeed, Precip1Hour, Prescip6Hour should be Decimals (divide by 10)

    });
};

async function writeToBq(obs) {
    // BQ expects an array of objects, but we only have 1
    // Make an array with a single element
    var rows = [];
    rows.push(obs);
  
    // Insert data into the observations table
    await bq
      .dataset(dataSetId)
      .table(tableId)
      .insert(rows)
    //   .import(Storage.bucket(file.bucket).file(file.name),importmetadata)
      .then( () => {
        rows.forEach ( (row) => {`Inserted: ${row}`} )
      })
      .catch( (err) => { console.log(`ERROR: ${err}`)})
}