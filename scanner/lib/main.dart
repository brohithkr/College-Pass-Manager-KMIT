// ignore_for_file: prefer_const_literals_to_create_immutables

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';

import './utlis.dart';

var publicKeyPem =
    "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAPCI7pP6xxNz0YGR29ykfGqsXIfwoi21\nJQr5sDjcSqLNGDHgPesdc+noOmlWyNMkHm3ohUUqAaIbuzHvKisGc58CAwEAAQ==\n-----END PUBLIC KEY-----\n";


void main() {
  runApp(const MaterialApp(
    title: "Scanner",
    home: SafeArea(
      child: MyApp(),
    ),
    color: Colors.lightBlue,
    debugShowCheckedModeBanner: false,
  ));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _scanData = "--";

  void scanQR() async {
    String scanRes;
    try {
      scanRes = await FlutterBarcodeScanner.scanBarcode(
          '#ff6666', 'Cancel', true, ScanMode.QR);
    } on PlatformException {
      scanRes = 'Failed to get platform version.';
    }

    setState(() {
      _scanData = scanRes;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Align(
          alignment: Alignment.center,
          child: MainPage(
            scanData: _scanData,
            toDo: scanQR,
          )
          // Column(
          //   mainAxisAlignment: MainAxisAlignment.center,
          //   children: [
          //     // ScanButton(),
          //     InkWell(
          //       onTap: () {
          //         showDialog(
          //           context: context,
          //           builder: (context) => ValidityMsg(isValid: true, year: 1),
          //         );
          //         print("Tapped!");
          //       },
          //       child: Opacity(
          //         opacity: .7,
          //         child: Container(
          //           height: 100,
          //           width: 100,
          //           decoration: BoxDecoration(
          //               borderRadius: BorderRadius.circular(8),
          //               color: Colors.amber),
          //           child: Center(
          //             child: Text(
          //               "Start Scanning",
          //               style: TextStyle(
          //                 fontSize: 20,
          //                 fontWeight: FontWeight.bold,
          //               ),
          //             ),
          //           ),
          //         ),
          //       ),
          //     ),
          //   ],
          // )
          ),
    );
  }
}

class MainPage extends StatelessWidget {
  final String scanData;
  final Function() toDo;
  const MainPage({required this.scanData, required this.toDo, super.key});

  @override
  Widget build(BuildContext context) {
    if (scanData == "--") {
      return Center(
        child: ScanButton(
          label: "Start Scanning",
          toDo: toDo,
        ),
      );
    } else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ValidityBox(isValid: true, year: 1),
          SizedBox(
            width: 300,
            child: Text(
              scanData,
              style: TextStyle(
                fontSize: 10,
              ),
            ),
          ),
          ScanButton(label: "Scan", toDo: toDo),
        ],
      );
    }
  }
}

class ScanButton extends StatelessWidget {
  final String label;
  final Function() toDo;
  const ScanButton({required this.label, required this.toDo, super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        toDo();
      },
      child: Text(
        label,
        style: TextStyle(
          fontSize: 20,
        ),
      ),
    );
  }
}

class ValidityBox extends StatelessWidget {
  final bool isValid;
  final int year;
  const ValidityBox({required this.isValid, required this.year, super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 400,
      width: 500,
      // color: Color.fromARGB(255, 24, 56, 74),
      child: Column(
        children: [
          AffirmIcon(isValid: isValid),
        ],
      ),
    );
  }
}

class AffirmIcon extends StatelessWidget {
  const AffirmIcon({required this.isValid, super.key});
  final bool isValid;

  final Color green = const Color.fromARGB(255, 7, 141, 63);
  final Color red = const Color.fromARGB(255, 186, 49, 49);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsetsDirectional.symmetric(vertical: 25),
      decoration: BoxDecoration(
        color: ((isValid) ? green : red),
        shape: BoxShape.circle,
      ),
      child: Icon(
        (isValid) ? Icons.done_rounded : Icons.close_rounded,
        color: Colors.white,
        size: 80,
      ),
    );
  }
}
