import { dlopen, FFIType, suffix } from "bun:ffi";

const path = `/home/rohith/Documents/myProjects/College-Pass-Manager-KMIT/server/src/encryption/target/debug/libencryption.${suffix}`;

const {
    symbols: {
        add,rsa_generate
    }
} = dlopen (
    path,{
    add: {
            args: [FFIType.i32, FFIType.i32],
            returns: (FFIType.cstring)
        },
    rsa_generate: {
        args: [],
        returns: FFIType.cstring
    }
}
)


console.log(rsa_generate().split("-----\n-----"))


let secrets_path = ""
if (process.env.DOCKER == "true") {
    secrets_path = "/DB/.secrets.json";
} else {
    secrets_path = "./DB/.secrets.json";
}

let file = Bun.file(secrets_path);
const secrets = (await file.json());

function Auth(token: string){
    if (token == secrets["auth_token"]) {
        return true
    }
    false
}

let Api = {
    "HEAD": {
        "/admin_setup": (req: Response) => {
            
        }
    }
}