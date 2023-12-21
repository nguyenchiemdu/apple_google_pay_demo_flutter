import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getKeys } from '../utils';
import { StripeConfig } from '../config';

const webhookController = async function (
    req: Request,
    res: Response
): Promise<Response> {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: Stripe.Event;
    const { secret_key } = getKeys();

    const stripe = new Stripe(secret_key as string, {
        apiVersion: "2023-10-16",
        typescript: true,
    });
    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'] || [],
            StripeConfig.stripeWebhookSecret
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
    }
    // console.log(JSON.stringify(event, null, 2));
    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    if (eventType === 'payment_intent.succeeded') {
        // Cast the event into a PaymentIntent to make use of the types.
        const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;

        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
        console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
        // TODO: update transaction via paymentIntent.id
        console.log(pi.id)

        console.log('💰 Payment captured!');
    }
    if (eventType === 'payment_intent.payment_failed') {
        // Cast the event into a PaymentIntent to make use of the types.
        const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
        console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
        console.log('❌ Payment failed.');
    }

    if (eventType === 'setup_intent.setup_failed') {
        console.log(`🔔  A SetupIntent has failed the to setup a PaymentMethod.`);
    }

    if (eventType === 'setup_intent.succeeded') {
        console.log(
            `🔔  A SetupIntent has successfully setup a PaymentMethod for future use.`
        );
    }

    if (eventType === 'setup_intent.created') {
        const setupIntent: Stripe.SetupIntent = data.object as Stripe.SetupIntent;
        console.log(`🔔  A new SetupIntent is created. ${setupIntent.id}`);
    }

    return res.sendStatus(200);
}

export { webhookController }