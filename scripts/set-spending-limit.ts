import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

async function run() {
    try {
        const cardholder = await stripe.issuing.cardholders.update(
            'ich_1Onz57EGUYrvyajfKez8wW9W',
            {
              spending_controls: {
                spending_limits: [
                  {
                    amount: 100000,
                    interval: 'all_time',
                  },
                ],
              },
            }
        );

        console.log(cardholder);
    } catch (err) {
        console.log('Smth went wrong');
        console.log(err);
    }
}

run();
