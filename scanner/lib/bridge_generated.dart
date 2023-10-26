// AUTO GENERATED FILE, DO NOT EDIT.
// Generated by `flutter_rust_bridge`@ 1.82.1.
// ignore_for_file: non_constant_identifier_names, unused_element, duplicate_ignore, directives_ordering, curly_braces_in_flow_control_structures, unnecessary_lambdas, slash_for_doc_comments, prefer_const_literals_to_create_immutables, implicit_dynamic_list_literal, duplicate_import, unused_import, unnecessary_import, prefer_single_quotes, prefer_const_constructors, use_super_parameters, always_use_package_imports, annotate_overrides, invalid_use_of_protected_member, constant_identifier_names, invalid_use_of_internal_member, prefer_is_empty, unnecessary_const

import "bridge_definitions.dart";
import 'dart:convert';
import 'dart:async';
import 'package:meta/meta.dart';
import 'package:flutter_rust_bridge/flutter_rust_bridge.dart';
import 'package:uuid/uuid.dart';
import 'bridge_generated.io.dart'
    if (dart.library.html) 'bridge_generated.web.dart';

class NativeImpl implements Native {
  final NativePlatform _platform;
  factory NativeImpl(ExternalLibrary dylib) =>
      NativeImpl.raw(NativePlatform(dylib));

  /// Only valid on web/WASM platforms.
  factory NativeImpl.wasm(FutureOr<WasmModule> module) =>
      NativeImpl(module as ExternalLibrary);
  NativeImpl.raw(this._platform);
  Future<(String, String)> rsaGenerate({dynamic hint}) {
    return _platform.executeNormal(FlutterRustBridgeTask(
      callFfi: (port_) => _platform.inner.wire_rsa_generate(port_),
      parseSuccessData: _wire2api___record__String_String,
      parseErrorData: null,
      constMeta: kRsaGenerateConstMeta,
      argValues: [],
      hint: hint,
    ));
  }

  FlutterRustBridgeTaskConstMeta get kRsaGenerateConstMeta =>
      const FlutterRustBridgeTaskConstMeta(
        debugName: "rsa_generate",
        argNames: [],
      );

  Future<String> rsaEncrypt(
      {required String privateKeyPem, required String data, dynamic hint}) {
    var arg0 = _platform.api2wire_String(privateKeyPem);
    var arg1 = _platform.api2wire_String(data);
    return _platform.executeNormal(FlutterRustBridgeTask(
      callFfi: (port_) => _platform.inner.wire_rsa_encrypt(port_, arg0, arg1),
      parseSuccessData: _wire2api_String,
      parseErrorData: null,
      constMeta: kRsaEncryptConstMeta,
      argValues: [privateKeyPem, data],
      hint: hint,
    ));
  }

  FlutterRustBridgeTaskConstMeta get kRsaEncryptConstMeta =>
      const FlutterRustBridgeTaskConstMeta(
        debugName: "rsa_encrypt",
        argNames: ["privateKeyPem", "data"],
      );

  Future<String> rsaDecrypt(
      {required String publicKeyPem, required String endata, dynamic hint}) {
    var arg0 = _platform.api2wire_String(publicKeyPem);
    var arg1 = _platform.api2wire_String(endata);
    return _platform.executeNormal(FlutterRustBridgeTask(
      callFfi: (port_) => _platform.inner.wire_rsa_decrypt(port_, arg0, arg1),
      parseSuccessData: _wire2api_String,
      parseErrorData: null,
      constMeta: kRsaDecryptConstMeta,
      argValues: [publicKeyPem, endata],
      hint: hint,
    ));
  }

  FlutterRustBridgeTaskConstMeta get kRsaDecryptConstMeta =>
      const FlutterRustBridgeTaskConstMeta(
        debugName: "rsa_decrypt",
        argNames: ["publicKeyPem", "endata"],
      );

  Future<int> add({required int left, required int right, dynamic hint}) {
    var arg0 = api2wire_usize(left);
    var arg1 = api2wire_usize(right);
    return _platform.executeNormal(FlutterRustBridgeTask(
      callFfi: (port_) => _platform.inner.wire_add(port_, arg0, arg1),
      parseSuccessData: _wire2api_usize,
      parseErrorData: null,
      constMeta: kAddConstMeta,
      argValues: [left, right],
      hint: hint,
    ));
  }

  FlutterRustBridgeTaskConstMeta get kAddConstMeta =>
      const FlutterRustBridgeTaskConstMeta(
        debugName: "add",
        argNames: ["left", "right"],
      );

  void dispose() {
    _platform.dispose();
  }
// Section: wire2api

  String _wire2api_String(dynamic raw) {
    return raw as String;
  }

  (String, String) _wire2api___record__String_String(dynamic raw) {
    final arr = raw as List<dynamic>;
    if (arr.length != 2) {
      throw Exception('Expected 2 elements, got ${arr.length}');
    }
    return (
      _wire2api_String(arr[0]),
      _wire2api_String(arr[1]),
    );
  }

  int _wire2api_u8(dynamic raw) {
    return raw as int;
  }

  Uint8List _wire2api_uint_8_list(dynamic raw) {
    return raw as Uint8List;
  }

  int _wire2api_usize(dynamic raw) {
    return castInt(raw);
  }
}

// Section: api2wire

@protected
int api2wire_u8(int raw) {
  return raw;
}

@protected
int api2wire_usize(int raw) {
  return raw;
}
// Section: finalizer
