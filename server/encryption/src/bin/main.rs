#![allow(unused_variables)]
#![allow(dead_code)]
#![allow(unused_imports)]

use encryption::*;
// use openssl::rsa::{Rsa,Padding};

fn main() {
    let (pri_str, pub_str) = rsa_generate();

    // println!("{:?}",(&pri_str, &pub_str));
    // let pub_rsa = Rsa::public_key_from_pem(pub_str.as_bytes()).unwrap();

    let msg = String::from("i am the danger, the one who knocks!");
    // let mut endata = vec![0; pub_rsa.size() as usize];
    // let res = pub_rsa.public_encrypt(msg, &mut endata, Padding::PKCS1);
    
    let enmsg = rsa_encrypt(&pri_str, &msg).unwrap();
    println!("Encrypted: {}",enmsg.len());

    let demsg = rsa_decrypt(&pub_str, &enmsg).unwrap();
    // assert!(msg == demsg);
    println!("Decrypted: {} {}",demsg, msg)
}

