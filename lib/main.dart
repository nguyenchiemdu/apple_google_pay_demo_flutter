import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:stripe_payment_demo/apple_pay_screen.dart';
import 'package:stripe_payment_demo/.env.dart';
import 'package:stripe_payment_demo/google_pay_screen.dart';

void main() async {
  //TODO: Init Stripe API key config
  WidgetsFlutterBinding.ensureInitialized();
  Stripe.publishableKey = stripePublishableKey;
  Stripe.merchantIdentifier = 'merchant.ana.anahealth';
  Stripe.urlScheme = 'flutterstripe';
  await Stripe.instance.applySettings();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  void enterPayment() {
    final platform = Theme.of(context).platform;
    if (platform == TargetPlatform.iOS) {
      log("iOS");
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => const ApplePayScreen()));
    }
    if (platform == TargetPlatform.android) {
      log("Android");
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => const GooglePayScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Center(
        child: ElevatedButton(
          onPressed: enterPayment,
          child: const Text("Enter Payment"),
        ),
      )),
    );
  }
}
