import {describe, test, expect} from "bun:test";
import * as db_connector from "../db_connector";
import Database from "bun:sqlite";
import * as types from "../types";

test(
    "playground", () => {}
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
                // let john: types.Verifier = {
                //     name: "John Wick",
                //     uid: "johnwick",
                //     passwd: "johny123",
                // }
                // let res = db_connector.create(db as Database, "Verifier", john);
                // console.log(res);
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