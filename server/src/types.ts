import Elysia, {t} from "elysia";

export interface User {
        uid: string;
        name: string;
        passwd: string;
}

export interface Verifier extends User {}

// export interface Mentor extends User {
//     public_key: string,
//     private_key: string
// }


export interface Pass {
    roll_no: string;
    issue_date: string;
    valid_till: string;
    pass_type: string;
    b64_img: string;
}

export interface Result {
    status: boolean;
    msg: string;
}

class ball {
    public color: String;
    constructor(color: String){
        this.color = color;
    }
}

let v2 = t.Object({
        uid: t.String(),
        name: t.String(),
        passwd: t.String()
    })
console.log(v2.required);

let hello = {
    "hello": "123",
};



console.log(hello)