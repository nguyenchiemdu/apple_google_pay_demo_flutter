import env from 'dotenv';
env.config({ path: './.env' });

export class StripeConfig {
    static stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
    static stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
    static stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
}