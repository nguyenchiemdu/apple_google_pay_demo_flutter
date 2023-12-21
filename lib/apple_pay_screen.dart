import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;
import 'package:pay/pay.dart' as pay;

import 'config.dart';

const _paymentItems = [
  pay.PaymentItem(
    label: 'Total',
    amount: '0.01',
    status: pay.PaymentItemStatus.final_price,
  )
];

class ApplePayScreen extends StatefulWidget {
  const ApplePayScreen({super.key});

  @override
  ApplePayScreenState createState() => ApplePayScreenState();
}

class ApplePayScreenState extends State<ApplePayScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  void update() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Apple Pay')),
      body: Center(
        // Apple Pay button
        child: pay.ApplePayButton(
          paymentConfiguration: pay.PaymentConfiguration.fromJsonString(
            jsonEncode(_paymentProfile),
          ),
          paymentItems: _paymentItems,
          margin: const EdgeInsets.only(top: 15),
          onPaymentResult: onApplePayResult,
          loadingIndicator: const Center(
            child: CircularProgressIndicator(),
          ),
          childOnError: const Text('Apple Pay is not available in this device'),
          onError: (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                    'There was an error while trying to perform the payment'),
              ),
            );
          },
        ),
      ),
    );
  }

  Future<void> onApplePayResult(paymentResult) async {
    try {
      debugPrint(paymentResult.toString());
      // 1. Get Stripe token from payment result
      final token = await Stripe.instance.createApplePayToken(paymentResult);

      // 2. fetch Intent Client Secret from backend
      final response = await fetchPaymentIntentClientSecret();
      final clientSecret = response['clientSecret'];

      final params = PaymentMethodParams.cardFromToken(
        paymentMethodData: PaymentMethodDataCardFromToken(
          token: token.id,
        ),
      );

      // 3. Confirm Apple pay payment method
      await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: params,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Apple Pay payment succesfully completed')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
      log(e.toString());
    }
  }

  Future<Map<String, dynamic>> fetchPaymentIntentClientSecret() async {
    final url = Uri.parse('${AppConfig.apiUrl}/create-payment-intent');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode({
        'email': 'example@gmail.com',
        'currency': 'usd',
        'items': ['id-1'],
        'request_three_d_secure': 'any',
      }),
    );
    return json.decode(response.body);
  }
}

const _paymentProfile = {
  "provider": "apple_pay",
  "data": {
    "merchantIdentifier": "merchant.ana.anahealth",
    "displayName": "Sam's Fish",
    "merchantCapabilities": ["3DS"],
    "supportedNetworks": ["amex", "visa", "discover", "masterCard"],
    "countryCode": "US",
    "currencyCode": "USD",
    "shippingMethods": [
      {
        "amount": "0.00",
        "detail": "Available within an hour",
        "identifier": "in_store_pickup",
        "label": "In-Store Pickup"
      },
      {
        "amount": "4.99",
        "detail": "5-8 Business Days",
        "identifier": "flat_rate_shipping_id_2",
        "label": "UPS Ground"
      },
      {
        "amount": "29.99",
        "detail": "1-3 Business Days",
        "identifier": "flat_rate_shipping_id_1",
        "label": "FedEx Priority Mail"
      }
    ]
  }
};
