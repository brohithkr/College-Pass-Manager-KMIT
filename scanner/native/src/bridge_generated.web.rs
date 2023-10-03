use super::*;
// Section: wire functions

#[wasm_bindgen]
pub fn wire_rsa_encrypt(port_: MessagePort, private_key_pem: String, data: String) {
    wire_rsa_encrypt_impl(port_, private_key_pem, data)
}

#[wasm_bindgen]
pub fn wire_rsa_decrypt(port_: MessagePort, public_key_pem: String, endata: String) {
    wire_rsa_decrypt_impl(port_, public_key_pem, endata)
}

#[wasm_bindgen]
pub fn wire_add(port_: MessagePort, left: usize, right: usize) {
    wire_add_impl(port_, left, right)
}

// Section: allocate functions

// Section: related functions

// Section: impl Wire2Api

impl Wire2Api<String> for String {
    fn wire2api(self) -> String {
        self
    }
}

impl Wire2Api<Vec<u8>> for Box<[u8]> {
    fn wire2api(self) -> Vec<u8> {
        self.into_vec()
    }
}

// Section: impl Wire2Api for JsValue

impl Wire2Api<String> for JsValue {
    fn wire2api(self) -> String {
        self.as_string().expect("non-UTF-8 string, or not a string")
    }
}
impl Wire2Api<u8> for JsValue {
    fn wire2api(self) -> u8 {
        self.unchecked_into_f64() as _
    }
}
impl Wire2Api<Vec<u8>> for JsValue {
    fn wire2api(self) -> Vec<u8> {
        self.unchecked_into::<js_sys::Uint8Array>().to_vec().into()
    }
}
impl Wire2Api<usize> for JsValue {
    fn wire2api(self) -> usize {
        self.unchecked_into_f64() as _
    }
}
