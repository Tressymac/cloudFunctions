const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

// entrypoint
exports.subscribe = async (message, context) => {
  try {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    
    // Writing message to Firestore
    const docRef = firestore.collection('subscribers').doc();
    await docRef.set(data);

    console.log(`The message written to Firestore: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error(`On now, there was an error sending the data to Firestore: ${error}`);
  }
};
