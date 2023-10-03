import 'dart:convert';

int rollToYear(String rollno) {
  var today = DateTime.now();
  int year = 0;
  year = (today.year - int.parse("20${rollno.substring(0, 2)}"));
  if (today.month > DateTime.september) {
    year += 1;
  }
  return year;
}

// int fromBytesToInt32(int b3, int b2, int b1, int b0) {
//   final int8List = Int8List(4)
//     ..[3] = b3
//     ..[2] = b2
//     ..[1] = b1
//     ..[0] = b0;
//   return int8List.asByteArray().getInt32(0);
// }



// int numFromBase64(String s) {
//   var bytes = base64Decode(s);
//   let num = bytes.
// }

// bool isValidPass(String issueDate) {

//   return true
// }

void main() {
  // print(rollToYear("21BD1A0505"));
}
