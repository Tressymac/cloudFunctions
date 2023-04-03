const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

//Entry Point 
exports.readFirestoreDocument = (doc, context) => {

    //"doc" refrences the documnet that was created in firestore
    // this is the doc that trigger the gcf 
    const version = process.env.K_REVISION;
    console.log(`This is the version ${version}`);

    // Output the entire document 
    console.log(`Document Content: `);
    console.log(doc.value.fields);

    // Write the value of the fields to the console
    console.log(doc.value.fields.first_Name.stringValue);
    console.log(doc.value.fields.last_Name.stringValue);
    console.log(doc.value.fields.age.integerValue);

    // Read value of the array field 
    doc.value.fields.locations.arrayValue.values.forEach((loc) => {
        console.log(loc.stringValue); 
    });

};