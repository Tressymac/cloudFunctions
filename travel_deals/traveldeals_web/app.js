const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const {PubSub} = require('@google-cloud/pubsub');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set the bame if our pubsub topic
const pubsub_topic = "travel_deals_signup";

// ROUTES
app.get('/', (req, res) => {
  //res.status(200).send('Hello, world!');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/subscribe', async (req, res) => {
    const email = req.body.email_address;
    const regions = req.body.watch_region;

    // Create a pubsub client 
    const PubSubClient = new PubSub();

    // Create our payload for the message 
    const message_data = JSON.stringify({
        email_address: email,
        watch_regions: regions
    });

    // Create a data buffer that allows us to stream the message to the topic
    const dataBuffer = Buffer.from(message_data);

    // Publish the message 
    const messageID = await PubSubClient.topic(pubsub_topic).publish(dataBuffer);

    console.log(`Message ID: ${messageID}`);

    res.status(200).send(`Thanks for registering for TravelData! <br/> Message ID: ${messageID}`)

});

app.listen(port, () => {
  console.log(`TravelDeals Web App listening on port ${port}`);
});