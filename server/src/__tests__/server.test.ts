import {describe, test, expect} from "bun:test";
import * as db_connector from "../db_connector";
import Database from "bun:sqlite";
import * as types from "../types";

var locurl = "localhost:3000"
var produrl = ""

test(
    "playground", async () => {
        // var res = await fetch (
        //     "localhost:3000/admin/ejs", {
        //         method: "POST",
        //         headers: {
        //             "authorization": "7831afe0eec0b3c7b9e86d20b6eb0908bcd1792f60a063059356a121b85cf42c",
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
                            "authorization": "7831afe0eec0b3c7b9e86d20b6eb0908bcd1792f60a063059356a121b85cf42c",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(
                            ver
                        )
                    }
                )
                console.log(await res.json())
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
        )
    }
)