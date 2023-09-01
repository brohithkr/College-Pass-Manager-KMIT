#![allow(unused_variables)]
#![allow(dead_code)]
#![allow(unused_imports)]

use encryption::*;
// use openssl::rsa::{Rsa,Padding};

fn main() {
    let (pri_str, pub_str) = rsa_generate();


    let msg = String::from("i am the danger, the one who knocks!");

    
    let enmsg = rsa_encrypt(&pri_str, &msg).unwrap();
    println!("Encrypted: {}",enmsg.len());

    let demsg = rsa_decrypt(&pub_str, &enmsg).unwrap();
    println!("Decrypted: {} {}",demsg, msg)
}

