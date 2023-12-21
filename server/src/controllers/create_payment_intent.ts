import { getKeys, calculateOrderAmount } from '../utils';
import { Request, Response } from 'express';
import Stripe from 'stripe';

const createPaymentIntent = async function (
    req: Request,
    res: Response
): Promise<Response> {
    const {
        email,
        items,
        currency,
        request_three_d_secure,
        payment_method_types = [],
        client = 'ios',
    }: {
        email: string;
        items: string[];
        currency: string;
        payment_method_types: string[];
        request_three_d_secure: 'any' | 'automatic';
        client: 'ios' | 'android';
    } = req.body;

    const { secret_key } = getKeys();

    const stripe = new Stripe(secret_key as string, {
        apiVersion: "2023-10-16",
        typescript: true,
    });

    const customer = await stripe.customers.create({ email });
    // Create a PaymentIntent with the order amount and currency.
    const params: Stripe.PaymentIntentCreateParams = {
        amount: calculateOrderAmount(items),
        currency,
        customer: customer.id,
        payment_method_options: {
            card: {
                request_three_d_secure: request_three_d_secure || 'automatic',
            },
            sofort: {
                preferred_language: 'en',
            },
            wechat_pay: {
                app_id: 'wx65907d6307c3827d',
                client: client,
            },
        },
        payment_method_types: payment_method_types,
    };

    try {
        const paymentIntent: Stripe.PaymentIntent =
            await stripe.paymentIntents.create(params);
        // TODO:
        // Create Transaction and store the paymentIntent.id
        console.log(paymentIntent.id);


        // Send publishable key and PaymentIntent client_secret to client.
        return res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        return res.send({
            error: error.raw.message,
        });
    }
}

export { createPaymentIntent }