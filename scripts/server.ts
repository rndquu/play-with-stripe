import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Replace this endpoint secret with your endpoint's unique secret
// If you're testing with the CLI, find the secret by running 'stripe listen'
// If you're using an endpoint defined with the API or Dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = '';
const express = require('express');
const app = express();

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  let event = request.body;

  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  console.log(event);

  if (event.type === 'issuing_authorization.request') {
    const auth = event.data.object;
    const approved = auth.amount <= 1000;
    response.writeHead(200, {"Stripe-Version": "2022-08-01", "Content-Type": "application/json"});
    const body = JSON.stringify({"approved": approved});
    response.end(body);
    return;
  }

  response.end();
});

app.listen(4242, () => console.log('Running on port 4242'));