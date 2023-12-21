import express from 'express';
import { getLocalIpAddress } from './utils';
import { createPaymentIntent } from './controllers/create_payment_intent';
import { bodyParserMiddleWare } from './middlewares/body_parser';
import { webhookController } from './controllers/webhook';
import bodyParser from 'body-parser';

const app = express();
const port = 4242;


app.use(bodyParserMiddleWare);

app.post('/create-payment-intent', createPaymentIntent);
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhookController)

app.listen(port, () => {
    const address = getLocalIpAddress();
    return console.log(`Express is listening at http://${address}:${port}`);
});