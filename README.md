# stripe_payment_demo

A Flutter project to demo Apple Pay and Google Pay combine with Stripe.

## Getting Started

### Add Stripe API key
Follow the [Stripe instruction](https://stripe.com/docs/keys) to get the Stripe API keys. <br/>
Add the API keys into <br/>
    ./server/.env
    ./lib/.env.dart 

### Start the Server

At the project directory
```bash
cd server
npm i
npm start
```
You will seee the IP address of server
```bash
> server@1.0.0 start
> npx tsc && node dist/app.js

Express is listening at http://192.168.0.5:4242
```
Copy this IP to ./lib/config.dart

```dart
class AppConfig {
  static const apiUrl = 'http://192.168.0.5:4242';
}

```

### Start Flutter project

```bash
fvm use 3.7.12
fvm flutter run
```