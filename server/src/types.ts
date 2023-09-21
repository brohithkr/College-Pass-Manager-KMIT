import { Interface } from "readline";

class User {
    public type = "User";
    public constructor(
        public uid: string,
        public name: string,
        public passwd: string
    ) {}
}

export class Verifier extends User {
    public type = "Verifier";
};

export class Mentor extends User {
    public type = "Mentor";
    // public_key: string,
    // private_key: string
}


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




let x = new Verifier("123","234","345");
console.log(Object.getOwnPropertyNames(User));