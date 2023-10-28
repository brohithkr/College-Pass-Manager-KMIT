import {describe, test, expect} from "bun:test";
import * as db_connector from "../db_connector";
import Database from "bun:sqlite";
import * as types from "../types";
import secret from "../../secrets/secrets.json"

var locurl = "localhost:3000"
var produrl = "https://kmitpass-n8f7.onrender.com"
// locurl = produrl


test(
    "playground", async () => {
        var res = await fetch(
            `${locurl}/get_issued_passes?type=json`,
        )


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
                            "authorization": secret.auth_token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({"rollno":"22BD1A0505","pass_type":"one_time"})
                    }
                )
                console.log(await res.text())
            }
        ),
        test(
            "get issued passes", async () => {
                let res = await fetch(
                    `${locurl}/latecomers?ret_type=json&rollno=22BD1A0505&from=25-10-2023&to=06-10-2023`,
                )
                console.log(await res.text())
            }
        ),
        test(
            "get timings", async () => {
                let res = await fetch(
                    `${locurl}/get_timings`,
                    {
                        method: "GET",
                    }
                )
                console.log(await res.text())
            }
        ),
        test(
            "update timings", async () => {
                let res = await fetch(
                    `${locurl}/edit_timings`,
                    {
                        method: "POST",
                        headers: {
                            "authorization": secret.auth_token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([{"opening_time":"12:15","closing_time":"13:00"},
                        {"opening_time":"12:15","closing_time":"13:00"},
                        {"opening_time":"12:15","closing_time":"13:00"},])
                    }
                )
                console.log(await res.text())
                console.log(res.status)
            }
        ),
        test(
            "rem latecomers", async () => {
                let res = await fetch(
                    `${locurl}/latecomers`,
                    {
                        method: 'POST',
                        headers: {
                            "authorization": secret.auth_token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([{
                            roll_no: "22BD1A0505",
                            date: Date.now()
                        }])
                    }
                )
                // console.log
                console.log(await (res.text()))
            }
        ),
        test(
            "get latecomers", async () => {
                let res = fetch(`${locurl}/latecomers?from=25-10-23&to=30-10-23&ret_type=json`)
                console.log(await (await res).text())
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
                            "authorization": secret.auth_token,
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