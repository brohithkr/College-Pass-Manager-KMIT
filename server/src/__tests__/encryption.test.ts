import {describe, test, expect} from "bun:test";
import {RSA_generate, RSA_encrypt, RSA_decrypt} from "../lib_encryption.ts";

describe(
    "Encryption", () => {
        var private_key_pem: string, public_key_pem: string;
        test(
            "RSA generate", () => {
                [private_key_pem, public_key_pem] = RSA_generate();
            }
        ),
        test("RSA encrypt and decrypt", () => {
            let data = "Hello World";
            let enc: any = RSA_encrypt(private_key_pem, data);
            // console.log(enc.Ok);
            let dec: any = RSA_decrypt(public_key_pem, enc.Ok);
            // console.log(dec.Ok);
            expect(dec.Ok).toContain(data);
        })
    }
)
