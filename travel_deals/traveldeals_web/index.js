const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

// entrypoint
exports.subscribe = async (message, context) => {
  try {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    
    // Writing message to Firestore
    const firestoreRef = firestore.collection('subscribers').doc();
    await firestoreRef.set(data);

    console.log(`The message written to Firestore: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error(`On no, there was an error sending the data to Firestore: ${error}`);
  }
};


