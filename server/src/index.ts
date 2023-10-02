import {Elysia, t} from 'elysia';
import { swagger } from '@elysiajs/swagger'
import {RSA_generate, RSA_encrypt} from "./lib_encryption"
import { Verifier, Pass, Result } from './types';
import * as db_connector from "./db_connector";
import * as utlis from "./utlis";

var secret_file = Bun.file("config/secrets.json")
var key_file = Bun.file("config/admin_keys.json")
var secrets: any = {}

if (secret_file.size == 0) {
    console.log("plsease provide secrets in config/.secrets.json")
}
if (key_file.size == 0) {
    console.log("plsease provide admin keys in config/admin_keys.json")
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

for(let i of Object.keys(db_connector.schema)) {
    db_connector.initialize_db(i)
}

const app = new Elysia()
.use(swagger())
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
            if(Date.now() <= (i.valid_till)) {
                return `Warning: ${body.rollno} already owns a Valid pass:\n${i.b64_img}`
            }
        }
        let pass = utlis.gen_pass(body.rollno, body.pass_type)
        let enpass = RSA_encrypt(
            secrets.private_key_pem,
            JSON.stringify(pass)
        ).Ok
        let passb64 = utlis.gen_qrcode(enpass)
        console.log(enpass)
        db_connector.create(
            db,
            "Issued_Pass",
            {
                roll_no: body.rollno,
                issue_date: ((new Date()).getTime()),
                b64_img: await passb64,
                pass_type: body.pass_type,
                valid_till: (pass.valid_till)
            } as Pass
        )        
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
        response: t.String(),
    }
)
.get(
    "/get_issued_passes", ({body, headers, query: {
        ret_type, based_on, rollno, from, to
    }, db}) => {
        var pass_lst: Pass[] = []
        if(based_on == "date") {
            let fromlst = (from as string).split("-").map((i) => parseInt(i))
            let tolst = (to as string).split("-").map((i) => parseInt(i))
            var from_stamp = Date.UTC(fromlst[2], fromlst[1]-1, fromlst[0])
            var to_stamp = Date.UTC(tolst[2], tolst[1]-1, tolst[0]) + 24*(60*60)*1000
            let query = db.query("SELECT * FROM Issued_Pass WHERE issue_date BETWEEN ? AND ?")
            pass_lst =  query.all(from_stamp, to_stamp) as Pass[]
        }

        if(based_on == "rollno") {
            pass_lst = db_connector.read(
                db,
                "Issued_Pass",
                "roll_no",
                rollno as string,
                []
            ) as Pass[]
        }

        if(pass_lst.length == 0) {
            return "No passes were were issued in this range"
        }

        if(ret_type == "json") {
            return pass_lst
        }

        if(ret_type == "csv") {
            var retstr = String(Object.keys(pass_lst[0]))
            for(let i of pass_lst) {
                retstr += "\n" + String(Object.values(i))
                .replace(i.issue_date.toString(), utlis.unix_to_ist_date(i.issue_date))
                .replace(i.valid_till.toString(), utlis.unix_to_ist_date(i.valid_till))
            }
            return new Response(
                retstr,
                {
                    headers: {
                        "Content-Type": "text/csv",
                        "Content-Disposition": `attachment; filename=passes_${Date.now()}.csv`
                    }
                }
            )
        }

        
    }
)
.post(
    "/edit_timings", ({body, headers, set, db}) => {
        if (headers.authorization != secrets.auth_token) {
            set.status = 401;
            return "Unauthorized";
        }
        let req: any = body;
        for(let i in req){
            db_connector.update(
                db,
                "Lunch_Timings",
                "year",
                (String(parseInt(i) + 1)),
                {
                    opening_time: req[i].opening_time,
                    closing_time: req[i].closing_time
                }
            )
        }
    },
    // {
    //     body: t.Object({
    //         year: t.String(),
    //         opening_time: t.String(),
    //         closing_time: t.String()
    //     })
    // }
)
.get(
    "/get_timings", ({body, headers, set, db}) => {
        return db_connector.read(
            db,
            "Lunch_Timings",
            "year",
            "*",
            []
        )
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