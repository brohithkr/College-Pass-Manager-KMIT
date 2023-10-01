import {Elysia, t} from 'elysia';
import {RSA_generate, RSA_encrypt} from "./lib_encryption"
import { Verifier, Pass, Result } from './types';
import * as db_connector from "./db_connector";
import * as utlis from "./utlis"

var secret_file = Bun.file("DB/.secrets.json")
var key_file = Bun.file("DB/admin_keys.json")
var secrets: any = {}

if (secret_file.size == 0) {
    console.log("plsease provide secrets in DB/.secrets.json")
}
if (key_file.size == 0) {
    console.log("plsease provide admin keys in DB/admin_keys.json")
    // let keys = {}
    // let keys =  RSA_generate()
    // Bun.write(key_file, JSON.stringify(keys))
    // secrets = {
    //     auth_token: (await secret_file.json()).auth_token,
    //     ...keys
    // }
} else {
    secrets = {
        auth_token: (await secret_file.json()).auth_token,
        ...(await key_file.json())
    }
}



const app = new Elysia()
.decorate("db", db_connector.connect())
.post(
    "/gen_pass",  async ({body, headers, set, db}) => {
        if (headers.authorization != secrets.auth_token) {
            set.status = 401;
            return "Unauthorized";
        }
        let prevPasses = db_connector.read(
            db,
            "Issued_Pass",
            "roll_no",
            body.rollno,
            []
        ) as Pass[]
        for(let i of prevPasses) {
            if(Date.now() <= parseInt(i.valid_till)) {
                return `Error: ${body.rollno} already owns a Valid pass`
            }
        }
        let pass = utlis.gen_pass(body.rollno, body.pass_type)
        let enpass = RSA_encrypt(
            secrets.private_key_pem,
            JSON.stringify(pass)
        ).Ok
        console.log(enpass)
        let passb64 = utlis.gen_qrcode(enpass)
        db_connector.create(
            db,
            "Issued_Pass",
            {
                roll_no: body.rollno,
                issue_date: String((new Date()).getTime()),
                b64_img: await passb64,
                pass_type: body.pass_type,
                valid_till: String(pass.valid_till)
            } as Pass
        )
        console.log(await passb64)
        
        return (await passb64)
    },
    {
        headers: t.Object(
            {
                authorization: t.String()
            }
        ),
        body: t.Object({
            rollno: t.String(),
            pass_type: t.String(),
        }),
        response: t.String()
    }
)
.post(
    "/admin/*", ({ headers, set, request }) => {
        if (headers.authorization == secrets.auth_token) {
            set.redirect = request.url
        }
        else {
            return {
                "status": `UnAuthorized!`
            }
        }
    }
)
.post(
    "/admin/register/verifier", async ({ body, db }) => {

        body.passwd = await Bun.password.hash(body.passwd)
        let res = db_connector.create(db, "Verifier", body);
        return res;
    },
    {
        body: t.Object({
            uid: t.String(),
            name: t.String(),
            passwd: t.String()
        }),
        response: t.Object({
            "status": t.Boolean(),
            "msg": t.String()
        })
    }
)
.post(
    "/login/verifier", async ({body, db}) => {
        let passwdhash: any = db_connector.read(
            db, "Verifier", "uid", body.uid, ["passwd"]
        );
        if ((passwdhash.length == 0)) {
            return {
                "status": false,
                "msg": "User not found"
            }
        }
        if (await Bun.password.verify(body.passwd, passwdhash[0].passwd)) {
            return {
                "status": true,
                "msg": "Login successful"
            }
        } else {
            return {
                "status": false,
                "msg": "Invalid Password"
            }
        }
    },
    {
        body: t.Object({
            uid: t.String(),
            passwd: t.String()
        })
    }
)
.get(
    "/", () => "Hello World"
).listen(3000)
console.log(`Listening at http://${app.server?.hostname}:${app.server?.port}`)