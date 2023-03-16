
// const {Storage} = require('@google-cloud/storage');

// exports.readObservation = (file, context) => {
//     const gcs = new Storage();
//     const datafile = gcs.buket(file.buket).file(file.name);
    
//     datafile.createReadStream()
//     .on('error', () => {
//         console.log(`Error in strean ${error}`);
//     })
//     .on('data', (row) => {
//         console.log(row);
//     })
//     .on('end', () => {
//         console.log('End of file reached');
//     })

//         console.log(`   Event: ${context.eventId}`);
//         console.log(`   Event Type: ${context.eventType}`);
//         console.log(`   Buket: ${file.buket}`);
//         console.log(`   File: ${file.name}`);

// };

const csv = require('csv-parser');
const fs = require('fs');
const {Storage} = require('@google-cloud/storage');
const {BigQuery} = require('@google-cloud/bigquery');

const bq = new BigQuery();
const dataSetId = 'weather_etl';
const tableId = 'observations';

exports.readObservation = (file) => {
    const gcs = new Storage();
    const dataFile = gcs.bucket(file.bucket).file(file.name);    

    dataFile.createReadStream()
    .pipe(csv())
    .on('data', (observation) => { 
        transformObjects(observation, file.name);
        writeToBq(observation, file.name);
        console.log(`this is the observation: ${observation}`)        
    })
    .on('end', () => {
        console.log('End reached');
    })
}; 

// Helper function 
function transformObjects(obs, name){
    Object.keys(obs).map((key) => {
        // console.log(`Key: ${key} value: ${obs[key]}`);
        if (obs[key] == "-9999.0") {
            obs[key] = null;
        } 
        else if (
            key == "year" || 
            key == "month" || 
            key == "day" || 
            key == "hour" || 
            key == "winddirection"|| 
            key == "sky"
        ){
            obs[key] = parseInt(obs[key]);
        } 
            else if (
                key == "airtemp" || 
                key == "dewpoint" || 
                key == "pressure" || 
                key == "windspeed" || 
                key == "precip1hour"|| 
                key == "precip6hour") {
                    const divided = obs[key] / 10;
                    obs[key] = parseFloat(divided);
            } 
                else if (key == "station"){
                    obs[key] = name;
                    // console.log(obs.station);
                } 
                else {
                    // console.log("Error");
                }
    });
    console.log(`This is the obs from transform ${obs}`);
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
      .then( () => {
        rows.forEach ( (row) => {`Inserted: ${row}`} )
      })
      .catch( (err) => { console.log(`ERROR: ${err}`)})
}