#![allow(unused_variables)]
#![allow(dead_code)]
#![allow(unused_imports)]

use base64::{engine::general_purpose, Engine as _};
use openssl::{
    error::ErrorStack,
    rsa::{Padding, Rsa},
};

fn b64_encode(data: Vec<u8>) -> String {
    general_purpose::STANDARD.encode(data)
}
fn b64_decode(data: String) -> Vec<u8> {
    general_purpose::STANDARD.decode(data).unwrap()
}

pub fn rsa_generate() -> (String, String) {
    let rsa = Rsa::generate(512).unwrap();
    let pri_key = rsa.private_key_to_pem().unwrap();
    let pub_key = rsa.public_key_to_pem().unwrap();
    let pri_str = String::from_utf8(pri_key).unwrap();
    let pub_str = String::from_utf8(pub_key).unwrap();
    (pri_str, pub_str)
}

pub fn rsa_encrypt(private_key_pem: String, data: String) -> String {
    let private_key = match Rsa::private_key_from_pem(private_key_pem.as_bytes()) {
        Ok(key) => key,
        Err(e) => return "Error: While getting private key from pem".to_string(),
    };

    let mut endata = vec![0; private_key.size() as usize];

    match private_key.private_encrypt(data.to_owned().as_bytes(), &mut endata, Padding::PKCS1) {
        Ok(num) => (),
        Err(e) => return "Error: While decrypting".to_string(),
    };

    b64_encode(endata)
}

pub fn rsa_decrypt(public_key_pem: String, endata: String) -> String {
    let public_key = match Rsa::public_key_from_pem(public_key_pem.as_bytes()) {
        Ok(key) => key,
        Err(e) => return "Error: While getting public key from pem".to_string(),
    };

    let mut data = vec![0; public_key.size() as usize];

    match public_key.public_decrypt(&b64_decode(endata.to_owned()), &mut data, Padding::PKCS1) {
        Ok(num) => (),
        Err(e) => return "Error: While decrypting".to_string(),
    };

    String::from_utf8(data).unwrap()
}

pub fn add(left: usize, right: usize) -> usize {
    left + right
}
