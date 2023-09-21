#![allow(unused_variables)]
#![allow(dead_code)]
#![allow(unused_imports)]

use encryption::*;
use openssl::error::ErrorStack;
use serde_json::json;
use serde::{Deserialize, Serialize};
// use openssl::rsa::{Rsa,Padding};



#[derive(Serialize, Deserialize)]
enum Hello {
    Hi(String),
}

fn main() {
    let hello = json!(Hello::Hi("Hello World!".to_string()));
    println!("{}",hello.to_string());
    let main_str = rsa_generate();
    let main_str = main_str.into_string().unwrap();
    let v: Vec<&str> = main_str.split("-----\n-----").collect();
    let (pri_str, pub_str) = (format!("{}-----",v[0]), format!("-----{}",v[1]));
    // println!("{} {}",pri_str.len(), pub_str.len());
    // println!("{} {}",pri_str, pub_str);

    let msg = String::from("i am the danger, the one who knocks!");

    
    // let enmsg =  rsa_encrypt(pri_str, &msg);
    // println!("{:?}",enmsg);
    // let en_str = enmsg.to_str().unwrap();
    // println!("{:?}",serde_json::from_str::<&str>(en_str).unwrap());
    // println!("{:?}",enmsg);
    // print!("Encrypted: {:?}",json!(enmsg).to_string());
    // println!("Encrypted: {}",enmsg.len());

    // let demsg = rsa_decrypt(&pub_str, &enmsg).unwrap();
    // println!("Decrypted: {} {}",demsg, msg)
}

