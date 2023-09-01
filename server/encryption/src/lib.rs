use openssl::rsa::{Padding, Rsa};
use base64::{Engine as _, engine::general_purpose};

fn b64_encode(data: Vec<u8>) -> String {general_purpose::STANDARD.encode(data)}
fn b64_decode(data: String) -> Vec<u8> {general_purpose::STANDARD.decode(data).unwrap()}

pub fn rsa_generate() -> (String, String) {
    let rsa = Rsa::generate(512).unwrap();
    let pri_key = rsa.private_key_to_pem().unwrap();
    let pub_key = rsa.public_key_to_pem().unwrap();
    let pri_str = String::from_utf8(pri_key).unwrap();
    let pub_str = String::from_utf8(pub_key).unwrap();
    (pri_str,pub_str)
}