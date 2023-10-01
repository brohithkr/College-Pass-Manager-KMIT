import QRCode from 'qrcode';
// import {RSA_encrypt, RSA_decrypt} from "./lib_encryption.ts"
// import keys from "../DB/admin_keys.json"
import Database from 'bun:sqlite';

export function get_ist_timestamp(date: Date) {
    return new Date(date.getTime() + (330) * 60 * 1000);
}

export async function gen_qrcode(data: string) {
    return (
        await QRCode.toDataURL(data, {errorCorrectionLevel: "M"})
        ).replace("data:image/png;base64,", "")
}

export function gen_pass(rollno: string, pass_type: string) {
    let today = new Date()
    var valid_till = today;
    // console.log(valid_till)
    if (pass_type == "one_time") {
        valid_till = new Date(
            valid_till.getTime() + (24*60*60*1000)
            )
    }
    else if (pass_type == "daily") {
        valid_till = new Date(
            Date.UTC(today.getFullYear(), today.getMonth()+6, today.getDate())
        )
    }
    else if (pass_type == "alumni") {
        valid_till = new Date(
            Date.UTC(today.getFullYear()+70, today.getMonth(), today.getDate())
        )
    }
    let pass = {
        rno: rollno,
        valid_till: valid_till.getTime()
    }
    // console.log(JSON.stringify(pass))

    return pass
}

// console.log((new Date((await gen_pass("22BD1A0505", "alumni")).valid_till)))