import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

async function run() {
    try {
        const cardholder = await stripe.issuing.cardholders.retrieve('ich_1Oh694F1BWbNiUTno8EtO19C');

        const card = await stripe.issuing.cards.create({
            currency: 'eur',
            type: 'virtual',
            cardholder: cardholder.id,
            status: 'active',
        });

        console.log(card);
    } catch (err) {
        console.log('Smth went wrong');
        console.log(err);
    }
}

run();