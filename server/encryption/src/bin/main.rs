use encryption::*;

use openssl::rsa::{Rsa,Padding};


fn main() {
    let (pri_str, pub_str) = rsa_generate();

    println!("{:?}",(&pri_str, &pub_str));
    let pub_rsa = Rsa::public_key_from_pem(pub_str.as_bytes()).unwrap();

    let msg = b"helllo dude";
    let mut endata = vec![0; pub_rsa.size() as usize];
    let res = pub_rsa.public_encrypt(msg, &mut endata, Padding::PKCS1);
    

}