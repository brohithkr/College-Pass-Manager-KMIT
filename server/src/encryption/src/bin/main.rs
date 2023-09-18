#![allow(unused_variables)]
#![allow(dead_code)]
#![allow(unused_imports)]

use encryption::*;
// use openssl::rsa::{Rsa,Padding};

fn main() {
    let main_str = rsa_generate();
    let main_S = main_str.into_string().unwrap();
    // let v: Vec<&str> = main_S.split("-----\n-----").collect();
    print!("{:?}",v);
    // let (pri_str, pub_str) = String::new(main_str.to_str()).split("-----\n -----").collect();
    // println!("{} {}",pri_str.len(), pub_str.len());
    // println!("{} {}",pri_str, pub_str);

    // let msg = String::from("i am the danger, the one who knocks!");

    
    // let enmsg = rsa_encrypt(&pri_str, &msg).unwrap();
    // println!("Encrypted: {}",enmsg.len());

    // let demsg = rsa_decrypt(&pub_str, &enmsg).unwrap();
    // println!("Decrypted: {} {}",demsg, msg)
}

