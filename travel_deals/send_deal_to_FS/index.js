const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

//Entry Point 
exports.readFirestoreDocument = async (doc, context) => {

    //"doc" refrences the documnet that was created in firestore
    // this is the doc that trigger the gcf 
    const version = process.env.K_REVISION;
    console.log(`This is the version ${version}`);

    // Output the entire document 
    console.log(`Document Content: `);
    console.log(doc.value.fields);

    // Write the value of the fields to the console
    console.log(doc.value.fields.email_address.stringValue);

    // Read value of the array field 
    doc.value.fields.watch_regions.arrayValue.values.forEach((loc) => {
        if (loc.stringValue.includes("Europe")){
            console.log(`They have chosen Europe: ${loc.stringValue}`); 
            writeToFS(doc.value.fields.email_address.stringValue, loc.stringValue)
        }
        if (loc.stringValue.includes("Africa")){
            console.log(`They have chosen Africa: ${loc.stringValue}`); 
            writeToFS(doc.value.fields.email_address.stringValue, loc.stringValue);
        }
        if (loc.stringValue.includes("Australia")){
            console.log(`They have chosen Australia: ${loc.stringValue}`); 
            writeToFS(doc.value.fields.email_address.stringValue, loc.stringValue);
        }
        if (loc.stringValue.includes("Asia")){
            console.log(`They have chosen Asia: ${loc.stringValue}`); 
            writeToFS(doc.value.fields.email_address.stringValue, loc.stringValue);
        }
        if (loc.stringValue.includes("South America")){
            console.log(`They have chosen South America: ${loc.stringValue}`); 
            writeToFS(doc.value.fields.email_address.stringValue, loc.stringValue);
        }
        if (loc.stringValue.includes("North America")){
            console.log(`They have chosen North America: ${loc.stringValue}`); 
            writeToFS(doc.value.fields.email_address.stringValue, loc.stringValue);
        }
    });
};

async function writeToFS(emailName, locationName) {
    try {
        const messageFromPubSub = {"email_address":emailName,"location":locationName, "Text": `Cheap ${locationName} Trip`, "headline": `Fly to ${locationName} for $199!`}
        console.log(messageFromPubSub)
        
        // Writing message to Firestore
        const firestoreRef = firestore.collection('deals').doc();
        await firestoreRef.set(messageFromPubSub);
    
        console.log(`The message written to Firestore: ${JSON.stringify(messageFromPubSub)}`);
    } catch (error) {
        console.error(`On no, there was an error sending the data to Firestore: ${error}`);
    }
};