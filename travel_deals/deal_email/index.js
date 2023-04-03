require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.sendDEAL = async (doc, context) => {
    var subsRef = firestore.collection('subscribers');
    //"doc" refrences the documnet that was created in firestore
    // this is the doc that trigger the gcf 
    const version = process.env.K_REVISION;
    console.log(`This is the version ${version}`);

    // Output the entire document 
    console.log(`Document Content: `);
    console.log(doc.value.fields);
    console.log(`This is the location: ${doc.value.fields.location.stringValue}`);
    if (doc.value.fields.location.stringValue.includes("Europe")){
        console.log("I have been called: Europe");
        var filteredSubsRef = subsRef.where("watch_regions", "array-contains", "Europe");
        var headlineData = doc.value.fields.headline.stringValue;
        await filteredSubsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                sendEmail(doc.data().email_address, headlineData);
            });
        });
    }
    if (doc.value.fields.location.stringValue.includes("Africa")){
        console.log("I have been called: Africa");
        var filteredSubsRef = subsRef.where("watch_regions", "array-contains", "Africa");
        var headlineData = doc.value.fields.headline.stringValue;
        await filteredSubsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                sendEmail(doc.data().email_address, headlineData);
            });
        });
    }
    if (doc.value.fields.location.stringValue.includes("Australia")){
        console.log("I have been called: Australia");
        var filteredSubsRef = subsRef.where("watch_regions", "array-contains", "Australia");
        var headlineData = doc.value.fields.headline.stringValue;
        await filteredSubsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                sendEmail(doc.data().email_address, headlineData);
            });
        });
    }
    if (doc.value.fields.location.stringValue.includes("Asia")){
        console.log("I have been called: Asia");
        var filteredSubsRef = subsRef.where("watch_regions", "array-contains", "Asia");
        var headlineData = doc.value.fields.headline.stringValue;
        await filteredSubsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                sendEmail(doc.data().email_address, headlineData);
            });
        });
    }
    if (doc.value.fields.location.stringValue.includes("North America")){
        console.log("I have been called: NA");
        var filteredSubsRef = subsRef.where("watch_regions", "array-contains", "North America");
        var headlineData = doc.value.fields.headline.stringValue;
        await filteredSubsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                sendEmail(doc.data().email_address, headlineData);
            });
        });
    }
    if (doc.value.fields.location.stringValue.includes("South America")){
        console.log("I have been called: SA");
        var filteredSubsRef = subsRef.where("watch_regions", "array-contains", "South America");
        var headlineData = doc.value.fields.headline.stringValue;
        await filteredSubsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                sendEmail(doc.data().email_address, headlineData);
            });
        });
    };
}

async function sendEmail(toAddress, headline) {
    console.log("Sending email function triggered")
    // GET OUR API KEY
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // CREATE AN EMAIL MESSAGE
    const msg = {
        to: toAddress,
        from: process.env.SENDGRID_SENDER,
        subject: `New Travel Deal ヾ(・ω・*)`,
        text: `Come quick! ${headline} (つ✧ω✧)つ`, 
        html: `Come quick! ${headline} (つ✧ω✧)つ`
    };
    console.log(`This is the message data: ${msg}`);

    // SEND THE MESSAGE THROUGH SENDGRID
    sgMail
    .send(msg)
    .then(() => {}, error => {
        console.error(error);
    });

    await console.log(`Sending email to ${toAddress}`);
};

