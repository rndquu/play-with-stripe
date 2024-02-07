import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

async function run() {
    try {
        const account = await stripe.accounts.retrieve();
        
        const cardholder = await stripe.issuing.cardholders.create(
            {
              name: 'Jenny Rosen',
              email: 'jenny.rosen@example.com',
              phone_number: '+18008675309',
              status: 'active',
              type: 'individual',
              individual: {
                first_name: 'Jenny',
                last_name: 'Rosen',
                dob: {
                  day: 1,
                  month: 11,
                  year: 1981,
                },
              },
              billing: {
                address: {
                  line1: '123 Main Street',
                  city: 'San Francisco',
                  state: 'CA',
                  postal_code: '94111',
                  country: 'LV',
                },
              },
            },
            {
              stripeAccount: account.id,
            }
        );

        console.log(cardholder);
    } catch (err) {
        console.log('Smth went wrong');
        console.log(err);
    }
}

run();