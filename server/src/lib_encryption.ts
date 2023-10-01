import { CString, ptr, dlopen, FFIType, suffix } from "bun:ffi";

var path = (process.env.DOCKER) ? `/app/libencryption.${suffix}` :`/home/rohith/Documents/myProjects/College-Pass-Manager-KMIT/server/src/encryption/target/debug/libencryption.${suffix}`;

path = "./libencryption.so"

const get_ptr_and_len = (s: string): [number, number] => {
    let enc = new TextEncoder();
    let b = enc.encode(s);
    let p = ptr(b);
    return [p as number, b.length];
}

const {
    symbols: {
        add, rsa_generate, rsa_encrypt, rsa_decrypt
    }
} = dlopen (
    path,{
    add: {
            args: [FFIType.i32, FFIType.i32],
            returns: FFIType.cstring
        },
    rsa_generate: {
        args: [],
        returns: FFIType.cstring
    },
    rsa_encrypt: {
            args: [FFIType.i64, FFIType.i32, FFIType.i64, FFIType.i32],
            returns: FFIType.cstring
        },
    rsa_decrypt: {
        args: [FFIType.i64, FFIType.i32, FFIType.i64, FFIType.i32],
        returns: FFIType.cstring
    },
} 
)

export function RSA_generate(): Object {
    let res = rsa_generate().toString();
    let [private_key_pem, public_key_pem] = res.split("-----\n-----");
    return  {
        private_key_pem: `${private_key_pem}-----`, 
        public_key_pem: `-----${public_key_pem}`,
    };
}

export function RSA_encrypt(private_key_pem: string, data: string): any {
    let [p, l] = get_ptr_and_len(private_key_pem);
    let [p1, l1] = get_ptr_and_len(data);
    let res = rsa_encrypt(p, l, p1, l1);
    return JSON.parse(res.toString());
}

export function RSA_decrypt(public_key_pem: string, data: string): any {
    let [p, l] = get_ptr_and_len(public_key_pem);
    let [p1, l1] = get_ptr_and_len(data);
    let res = rsa_decrypt(p, l, p1, l1);
    return JSON.parse(res.toString());
}

