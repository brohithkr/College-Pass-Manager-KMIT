import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import 'package:http/http.dart' as http;
import 'secrets.dart';

Future<Database> openDB() async {
  // await databaseFactory
  //     .deleteDatabase(join(await getDatabasesPath(), 'doggie_database.db'));
  final database = openDatabase(
    join(await getDatabasesPath(), 'data.db'),
    onCreate: (db, version) {
      return db.execute(
        'CREATE TABLE latecomers (rollno varchar(11), date integer)',
      );
    },
    version: 1,
  );
  return database;
}

class Latecomer {
  String rollno;
  late int date;
  Latecomer({required this.rollno}) {
    date = DateTime.now().millisecondsSinceEpoch;
  }

  Map<String, dynamic> toMap() {
    return {
      'rollno': rollno,
      'date': date,
    };
  }

  @override
  String toString() {
    return "$rollno on $date";
  }

  Future<void> insertToDB() async {
    var db = await openDB();
    await db.insert("latecomers", toMap());
  }

  // static Future<List<Latecomer>> latecomers() async {
  //   final db = await openDB();
  //   var res = await db.query("latecomers");
  //   return List.generate(res.length, (index) => {
  //     return
  //   })
  // }

  static void postData() async {
    var db = await openDB();
    var res = await db.query("latecomers");
    // print(res);
    var url = Uri.parse(hostUrl);
    http.post(url, body: res);
  }
}
