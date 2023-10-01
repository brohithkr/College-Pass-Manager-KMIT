import {describe, test, expect} from "bun:test";
import * as db_connector from "../db_connector";
import Database from "bun:sqlite";
import * as types from "../types";
import secrect from "../../DB/.secrets.json"

var locurl = "localhost:3000"
var produrl = ""

test(
    "playground", async () => {
        // var res = await fetch (
        //     "localhost:3000/admin/ejs", {
        //         method: "POST",
        //         headers: {
        //             "authorization": "",
        //             "Content-Type": "application/json",
        //             // "method": "POST"
        //         },
        //         body: JSON.stringify({"hello": "get"})
        //     }
        // );
        // console.log((await res.json()))
    }
)

describe(
    "api", () => {
        test(
            "gen pass",async () => {
                let res = await fetch(
                    `${locurl}/gen_pass`,
                    {
                        method: "POST",
                        headers: {
                            "authorization": secrect.auth_token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({"rollno":"22BD1A0505","pass_type":"one_time"})
                    }
                )
                console.log(await res.text())
            }
        ),
        test(
            "add verifier", async () => {
                let ver: types.Verifier = {
                    name: "jane",
                    uid: "janedoe",
                    passwd: "456",
                }
                let res = await fetch (
                    `${locurl}/admin/register/verifier`, {
                        method: "POST",
                        headers: {
                            "authorization": secrect.auth_token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(
                            ver
                        )
                    }
                )
                console.log(await res.text())
            }
        ),
        test(
            "login verifier", async () => {
                let ver = {
                    "uid": "janedoe",
                    "passwd": "456"
                }
                let res = await  fetch (
                    `${locurl}/login/verifier`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(
                            ver
                        )
                    }
                )
                console.log(await res.text())

            }
        )
    }
)


describe(
    "DB Connector", () => {
        var db: Database | null = null;
        test(
            "connect", () => {
                db = db_connector.connect();
            }
        )
        test(
            "create", () => {
                let john: types.Verifier = {
                    name: "John Wick",
                    uid: "johnwick",
                    passwd: "johny123",
                }
                let res = db_connector.create(db as Database, "Verifier", john);
                console.log(res);
            }
        ),
        test(
            "read", () => {
                expect(
                    db_connector.read(
                        db as Database,
                        "Verifier",
                        "uid",
                        "johnwick",
                        ["name","passwd"]
                    )
                )
                .toEqual(
                    [{
                        name: "John Wick",
                        passwd: "johny123"
                    }]
                )
            }
        ),
        test(
            "update", () => {
                let updated = {
                    name: "John Wick",
                    passwd: "johny1234",
                };
                db_connector.update(
                    db as Database,
                    "Verifier",
                    "uid",
                    "johnwick",
                    updated
                );

                let res = db_connector.read(
                    db as Database,
                    "Verifier",
                    "uid",
                    "johnwick",
                    ["name","passwd"]
                );
                // console.log(res);
                expect(res).toEqual([updated]);
                
            }
        ),
        test(
            "delete", () => {
                db_connector.delete_row(
                    db as Database,
                    "Verifier",
                    "uid",
                    "johnwick"
                );
                let res = db_connector.read(
                    db as Database,
                    "Verifier",
                    "uid",
                    "johnwick",
                    ["name","passwd"]
                );
                expect(res).toEqual([]);
            }
        )
    }
)