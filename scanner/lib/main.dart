// ignore_for_file: prefer_const_literals_to_create_immutables

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';

import 'ffi.dart';
import './utlis.dart';

late var timings;

void main() {
  // print(api.add(left: 1, right: 3));
  timings = [
    {"year": 1, "opening_time": "12:15", "closing_time": "13:00"},
    {"year": 2, "opening_time": "12:15", "closing_time": "13:00"},
    {"year": 3, "opening_time": "12:15", "closing_time": "13:00"}
  ];
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
        '#ff6666',
        'Cancel',
        true,
        ScanMode.QR,
      );
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
          )),
    );
  }
}

class MainPage extends StatelessWidget {
  final String scanData;
  final Function() toDo;
  const MainPage({required this.scanData, required this.toDo, super.key});

  @override
  Widget build(BuildContext context) {
    if (scanData == "--" || scanData == "-1") {
      return Center(
        child: ScanButton(
          label: "Start Scanning",
          toDo: toDo,
        ),
      );
    } else {
      var pass = (getDecryptedData(scanData));
      if (pass == null) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ValidityBox(isValid: false, msg: "Not a valid pass!".toString()),
            ScanButton(label: "Scan", toDo: toDo),
          ],
        );
      }
      bool isValid = isValidPass(pass, timings);
      int year = rollToYear(pass['rno']);
      return Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ValidityBox(isValid: isValid, msg: year.toString()),
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
  final String msg;
  const ValidityBox({required this.isValid, required this.msg, super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 400,
      width: 500,
      // color: Color.fromARGB(255, 24, 56, 74),
      child: Column(
        children: [
          AffirmIcon(isValid: isValid),
          Center(
            child: Text(
              (msg),
              style: TextStyle(
                  fontSize: (msg.contains('!')) ? 20 : 40,
                  color: (msg.contains('!')) ? Colors.red[900] : Colors.black),
            ),
          ),
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
