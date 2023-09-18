import {describe, test, expect} from "bun:test";
import * as db_connector from "../db_connector";
import Database from "bun:sqlite";
import * as types from "../types";
import { Verify } from "crypto";


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
                db_connector.create(db as Database, "Verifier", john);
            }
        )
        // test(
        //     "update", 
        // )
    }
)