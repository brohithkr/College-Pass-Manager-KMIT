import {Elysia, t} from 'elysia';
import {RSA_generate} from "./lib_encryption"
import secrets from "../DB/.secrets.json"
import { Verifier, Pass, Result } from './types';
import * as db_connector from "./db_connector";


const app = new Elysia()
// .decorate()
.post(
    "/admin/*", ({ headers, set, request }) => {
        if (headers.authorization === secrets.auth_token) {
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
    "/admin/register/verifier", ({ body }) => {
        let db = db_connector.connect();
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
    "/login/verifier", ({body}) => {

    }
)
.get(
    "/rsa", () => RSA_generate()
)
.get(
    "/", () => "Hello World"
).listen(3000)

console.log(`Listening at http://${app.server?.hostname}:${app.server?.port}`)