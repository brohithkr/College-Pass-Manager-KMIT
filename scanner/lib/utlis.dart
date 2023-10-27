import 'dart:convert';
// import 'dart:typed_data';
import 'package:http/http.dart' as http;

// import 'ffi.dart';

var hosturl = "http://localhost:3000";

int rollToYear(String rollno) {
  var today = DateTime.now();
  int year = 0;
  year = (today.year - int.parse("20${rollno.substring(0, 2)}"));
  if (today.month > DateTime.september) {
    year += 1;
  }
  return year;
}

dynamic getDecryptedData(String endata) {
  Map res;
  try {
    res = jsonDecode(endata);
    //   if (res.keys.toList() != ["rno", "valid_till"]) {
    //     return null;
  } catch (e) {
    return null;
  }
  return res;
}

dynamic getTimings() async {
  var res = await http.get(
    Uri.parse("$hosturl/get_timings"),
  );
  return jsonDecode(res.body);
}

bool isValidPass(dynamic pass, dynamic timings) {
  // print(timings[]);
  int validTill = (pass['valid_till']);
  var now = DateTime.now();
  if (now.millisecondsSinceEpoch > validTill) {
    return false;
  }

  int year = rollToYear(pass['rno']);
  if (year >= 4) {
    return true;
  }
  var timing = timings[year - 1];

  var st_arr = (timing['opening_time'].split(":") as List<String>)
      .map((e) => int.parse(e))
      .toList();
  var en_arr = (timing['closing_time'].split(":") as List<String>)
      .map((e) => int.parse(e))
      .toList();

  int startStamp =
      DateTime(now.year, now.month, now.day, st_arr[0], st_arr[1], 0)
          .millisecondsSinceEpoch;
  int endStamp = DateTime(now.year, now.month, now.day, en_arr[0], en_arr[1], 0)
      .millisecondsSinceEpoch;
  int nowStamp = now.millisecondsSinceEpoch;
  if (!(nowStamp > startStamp && nowStamp < endStamp)) {
    return false;
  }

  return true;
}



bool remLatecomers(String rollno) {

  return true;
}

// void main() async {

// }
