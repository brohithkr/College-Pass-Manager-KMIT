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
    issue_date: number;
    valid_till: number;
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
