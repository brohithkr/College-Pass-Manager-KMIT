#![allow(unused_variables)]
#![allow(dead_code)]
#![allow(unused_imports)]

use openssl::{rsa::{ Rsa ,Padding }, error::ErrorStack};
use base64::{Engine as _, engine::general_purpose};

fn b64_encode(data: Vec<u8>) -> String {general_purpose::STANDARD.encode(data)}
fn b64_decode(data: String) -> Vec<u8> {general_purpose::STANDARD.decode(data).unwrap()}

fn rsa_generate() -> (String, String) {
    let rsa = Rsa::generate(512).unwrap();
    let pri_key = rsa.private_key_to_pem().unwrap();
    let pub_key = rsa.public_key_to_pem().unwrap();
    let pri_str = String::from_utf8(pri_key).unwrap();
    let pub_str = String::from_utf8(pub_key).unwrap();
    (pri_str,pub_str)
}


pub fn rsa_encrypt(private_key_pem: &String, data: &String) -> Result<String,ErrorStack> {
    let private_key =  Rsa::private_key_from_pem(
        private_key_pem.as_bytes()
    )?;

    let mut endata = vec![0; private_key.size() as usize];

    private_key.private_encrypt(
        data.to_owned().as_bytes(),
        &mut endata,
        Padding::PKCS1
    )?;

    Ok(
        b64_encode(endata)
    )
}

pub fn rsa_decrypt(public_key_pem: &String, endata: &String) -> Result<String, ErrorStack> {
    let public_key = Rsa::public_key_from_pem(
        public_key_pem.as_bytes()
    )?;

    let mut data = vec![0; public_key.size() as usize];
    
    public_key.public_decrypt(
        &b64_decode(endata.to_owned()),
        &mut data, 
        Padding::PKCS1
    )?;

    Ok(
        String::from_utf8(data).unwrap()
    )
}
