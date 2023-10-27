import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger'
// import {RSA_generate, RSA_encrypt, encrypt} from "./lib_encryption"
import { Verifier, Pass, Result } from './types';
import * as db_connector from "./db_connector";
import * as utlis from "./utlis";
import { env } from 'process';

var secrets = {
    auth_token: process.env.AUTH
}
var secret_file = Bun.file("secrets/secrets.json")
var key_file = Bun.file("secrets/admin_keys.json")
if (secret_file.size == 0) {
    console.log("plsease provide secrets in secrets/.secrets.json")
}
if (key_file.size == 0) {
    console.log("plsease provide admin keys in secrets/admin_keys.json")
    // let keys = {}
    // let keys =  RSA_generate()
    // Bun.write(key_file, JSON.stringify(keys))
    // secrets = {
    //     auth_token: (await secret_file.json()).auth_token,
    //     ...keys
    // }
} else if (secrets.auth_token == undefined || secrets.auth_token == null) {

    secrets = {
        auth_token: (await secret_file.json()).auth_token,
        // ...(await key_file.json())
    }
}

for (let i of Object.keys(db_connector.schema)) {
    db_connector.initialize_db(i)
}

const app = new Elysia()
    .use(swagger())
    .decorate("db", db_connector.connect())
    .post(
        "/gen_pass", async ({ body, headers, set, db }) => {
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
            for (let i of prevPasses) {
                if (Date.now() <= (i.valid_till)) {
                    return `Warning: ${body.rollno} already owns a Valid pass:\n${i.b64_img}`
                }
            }
            let pass = utlis.gen_pass(body.rollno, body.pass_type)
            // let enpass = RSA_encrypt(
            //     secrets.private_key_pem,
            //     JSON.stringify(pass)
            // ).Ok

            let enpass = (JSON.stringify(pass));
            console.log(enpass);
            let passb64 = utlis.gen_qrcode(enpass)
            // console.log(enpass)
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
        "/get_issued_passes", ({ body, headers, query: {
            ret_type, based_on, rollno, from, to
        }, db }) => {
        var pass_lst: Pass[] = []

        if ((from != undefined) && (to != undefined)) {
            let fromlst = (from as string).split("-").map((i) => parseInt(i))
            let tolst = (to as string).split("-").map((i) => parseInt(i))
            var from_stamp = Date.UTC(fromlst[2], fromlst[1] - 1, fromlst[0])
            var to_stamp = Date.UTC(tolst[2], tolst[1] - 1, tolst[0]) + 24 * (60 * 60) * 1000
            if (rollno != undefined) {
                let cmd = `SELECT roll_no,issue_date,valid_till,pass_type FROM Issued_Pass WHERE (roll_no = '${rollno}') AND (issue_date BETWEEN ${from_stamp} AND ${to_stamp})`
                let query = db.query(cmd)
                pass_lst = query.all() as Pass[]
            }
            else {
                let query = db.query("SELECT * FROM Issued_Pass WHERE issue_date BETWEEN ? AND ?")
                pass_lst = query.all(from_stamp, to_stamp) as Pass[]
            }
        }
        else if (rollno != undefined) {
            pass_lst = db_connector.read(
                db,
                "Issued_Pass",
                "roll_no",
                rollno as string,
                []
            ) as Pass[]
        }

        if (pass_lst.length == 0) {
            return "No passes were found."
        }

        if (ret_type == "json") {
            return pass_lst
        }

        if (ret_type == "csv") {
            var retstr = String(Object.keys(pass_lst[0]))
            for (let i of pass_lst) {
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
        "/edit_timings", ({ body, headers, set, db }) => {
            if (headers.authorization != secrets.auth_token) {
                set.status = 401;
                return "Unauthorized";
            }
            var table_name = "Lunch_Timings"
            let req: any = body;
            for (let i in req) {
                db_connector.update(
                    db,
                    table_name,
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
        "/get_timings", ({ body, headers, set, db }) => {
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
        "/latecomers", ({ headers, set, body, db }) => {
            console.log("here")
            if (headers.authorization != secrets.auth_token) {
                set.status = 401;
                return "Unauthorized";
            }
            console.log("here")
            let res = db_connector.create(
                db, "latecomers", {
                    roll_no: body.rollno,
                    date: Date.now()
                }
            )
            console.log("here")
            // set.status = 200
        },
        {
            body: t.Object({
                rollno: t.String()
            })
        }
    )
    .get(
        "/latecomers", ({ body, headers, query: {
            ret_type, rollno, from, to
        }, db }) => {
        var res_lst: any[] = []

        if ((from != undefined) && (to != undefined)) {
            let fromlst = (from as string).split("-").map((i) => parseInt(i))
            let tolst = (to as string).split("-").map((i) => parseInt(i))
            var from_stamp = Date.UTC(fromlst[2], fromlst[1] - 1, fromlst[0])
            var to_stamp = Date.UTC(tolst[2], tolst[1] - 1, tolst[0]) + 24 * (60 * 60) * 1000
            if (rollno != undefined) {
                let cmd = `SELECT roll_no,date FROM latecomers WHERE (roll_no = '${rollno}') AND (date BETWEEN ${from_stamp} AND ${to_stamp})`
                let query = db.query(cmd)
                res_lst = query.all()
            }
            else {
                let query = db.query("SELECT * FROM latecomers WHERE date BETWEEN ? AND ?")
                res_lst = query.all(from_stamp, to_stamp)
            }
        }
        else if (rollno != undefined) {
            res_lst = db_connector.read(
                db,
                "latecomers",
                "roll_no",
                rollno as string,
                []
            )
        }

        if (res_lst.length == 0) {
            return "No latecomers were found."
        }

        if (ret_type == "json") {
            return res_lst
        }

        if (ret_type == "csv") {
            var retstr = String(Object.keys(res_lst[0]))
            for (let i of res_lst) {
                retstr += "\n" + String(Object.values(i))
                    .replace(i.date.toString(), utlis.unix_to_ist_date(i.date))
            }
            return new Response(
                retstr,
                {
                    headers: {
                        "Content-Type": "text/csv",
                        "Content-Disposition": `attachment; filename=latecomers_${Date.now()}.csv`
                    }
                }
            )
        }


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
            // response: t.Object({
            //     "status": t.Boolean(),
            //     "msg": t.String()
            // })
        }
    )
    .post(
        "/login/verifier", async ({ body, db }) => {
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