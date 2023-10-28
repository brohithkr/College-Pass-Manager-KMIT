import 'dart:async';

import 'dart:convert';
import 'package:flutter/widgets.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import 'package:http/http.dart' as http;
import 'secrets.dart';

void createTables(Database db) {
  db.execute('CREATE TABLE latecomers (rollno varchar(11), date integer)');
  db.execute('''CREATE TABLE Lunch_Timings (
        year varchar(2) UNIQUE,
        opening_time varchar(7),
        closing_time varchar(7)
    );''');
  db.execute(
      "INSERT INTO Lunch_Timings (year,opening_time,closing_time) VALUES ('1', '12:15', '13:00')");
  db.execute(
      "INSERT INTO Lunch_Timings (year,opening_time,closing_time) VALUES ('2', '12:15', '13:00')");
  db.execute(
      "INSERT INTO Lunch_Timings (year,opening_time,closing_time) VALUES ('3', '12:15', '13:00')");
}

Future<Database> openDB() async {
  // await databaseFactory
  //     .deleteDatabase(join(await getDatabasesPath(), 'data.db'));
  final database = openDatabase(
    join(await getDatabasesPath(), 'data.db'),
    onCreate: (db, version) {
      createTables(db);
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

  Future<bool> insertToDB() async {
    try {
      var db = await openDB();
      await db.insert("latecomers", toMap());
      // var res = await db.query("Lunch_Timings");
      // print(res);
      return true;
    } catch (e) {
      return false;
    }
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

void refreshTimings() async {
  var res = await http.get(Uri.parse('$hostUrl/get_timings'));
  var timings = jsonDecode(res.body);
  var db = await openDB();
  for (var i in timings) {
    db.update("Lunch_Timings", i, where: 'year = ?', whereArgs: [i.year]);
  }
}
