interface User {
    uid: string;
    name: string;
    passwd: string;
}

interface Verifier extends User {};

interface Pass {
    roll_no: string;
    issue_date: string;
    valid_till: string;
    pass_type: string;
    b64_img: string;
}


export {Verifier} ;