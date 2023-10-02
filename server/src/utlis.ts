import QRCode from 'qrcode';

import Database from 'bun:sqlite';

export function get_ist_timestamp(date: Date) {
    return new Date(date.getTime() + (330) * 60 * 1000);
}

export function unix_to_ist_date(unix: number): string {
    let date = new Date(unix);
    date = get_ist_timestamp(date);
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
}




export async function gen_qrcode(data: string) {
    return (
        await QRCode.toDataURL(data, {errorCorrectionLevel: "M"})
        ).replace("data:image/png;base64,", "")
}

export function gen_pass(rollno: string, pass_type: string) {
    let today = new Date()
    var valid_till = today;
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

    return pass
}

