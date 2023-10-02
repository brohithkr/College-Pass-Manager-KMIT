// #![alloc]
use openssl::rsa::{ Rsa ,Padding };
use base64::{Engine as _, engine::general_purpose};
use serde_json::json;
use std::ffi::CString;
use std::ptr::slice_from_raw_parts;

fn b64_encode(data: Vec<u8>) -> String {general_purpose::STANDARD.encode(data)}
fn b64_decode(data: String) -> Vec<u8> {general_purpose::STANDARD.decode(data).unwrap()}
fn get_cstring(obj: Result<String,String>) -> CString {
    CString::new(
        json!(obj).to_string()
    ).unwrap()
}
fn get_string_from_addr(addr: isize, len: i32) -> String {
    let ptr = slice_from_raw_parts(addr as *const u8, len as usize);
    unsafe{String::from_utf8((&*ptr).to_vec()).unwrap()}
}

#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> CString {
    // CString::new(format!("{}",a+b)).expect("Failed to convert")
    return CString::new(format!("{}",a+b)).expect("Failed to convert");
}

#[no_mangle]
pub extern "C" fn rsa_generate() -> CString {
    let rsa = Rsa::generate(512).unwrap();
    let pri_key = rsa.private_key_to_pem().unwrap();
    let pub_key = rsa.public_key_to_pem().unwrap();
    let pri_str = String::from_utf8(pri_key).unwrap();
    let pub_str = String::from_utf8(pub_key).unwrap();
    CString::new(pri_str + &pub_str).expect("Unable to convert")
}

#[no_mangle]
pub extern "C" fn rsa_encrypt(private_key_pem: isize, len_pem: i32, data: isize, len_data: i32) -> CString {

    let private_key_pem = get_string_from_addr(private_key_pem, len_pem);
    let data = get_string_from_addr(data, len_data);

    let private_key =  match Rsa::private_key_from_pem(
        private_key_pem.as_bytes()
    ) {
        Ok(key) => key,
        Err(e) => return get_cstring(Err::<String, String>(e.to_string())),
    };

    let mut endata = vec![0; private_key.size() as usize];

    match private_key.private_encrypt(
        data.to_owned().as_bytes(),
        &mut endata,
        Padding::PKCS1
    ) {
        Ok(s) => (),
        Err(e) => return CString::new(
            json!(
                Err::<String, String>(e.to_string())
            ).to_string()
        ).unwrap()
    };

    get_cstring(Ok::<String, String>(
        b64_encode(endata)
    ))
}



#[no_mangle]
pub extern "C" fn rsa_decrypt(public_key_pem: isize, len_pem: i32, endata: isize, len_endata: i32) -> CString {

    let public_key_pem = get_string_from_addr(public_key_pem, len_pem);
    let endata = get_string_from_addr(endata, len_endata);
    let public_key = match Rsa::public_key_from_pem(
        public_key_pem.as_byte    unsafe{String::from_utf8((&*ptr).to_vec()).unwrap()}
        s()
    ) {
        Ok(key) => key,
        Err(e) => return get_cstring(Err::<String,String>(e.to_string()))
    };

    let mut data = vec![0; public_key.size() as usize];
    
    // let endata = String::from(endata.to_str().unwrap());
    match public_key.public_decrypt(
        &b64_decode(endata.to_owned()),
        &mut data, 
        Padding::PKCS1
    ) {
        Ok(d) => (),
        Err(e) => return get_cstring(Err::<String, String>(e.to_string()))
    };

    get_cstring(Ok::<String,String>(
        String::from_utf8(data).unwrap()
    ))
}

#[no_mangle]
pub extern  "C" fn substract(a: i32, b: i32) -> i32 {
    a-b
}