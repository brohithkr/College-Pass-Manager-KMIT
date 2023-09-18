import {Database} from "bun:sqlite";
import { expect } from "bun:test";

// import {Verifier} from "./types.ts";

// var db_path = (process.env.DOCKER) ? "DB/data.db" : "/DB/data.db";
var db_path = "DB/data.db";

function initialize_db() {
    const db = new Database(db_path, {create: true});
    let schema: any = {
        "Verifier": `
        CREATE TABLE Verifier (
            uid varchar(30) UNIQUE,
            name varchar(50),
            passwd varchar(30)
        )
        `,
        "Issued_Pass": `
        CREATE TABLE Issued_Pass (
            roll_no varchar(11),
            issue_date varchar(10),
            valid_till varchar(10),
            pass_type varchar(15),
            b64_img text
        )
        `
    };
    for (let i in (schema)) {
        try{
            db.run(schema[i]);
            console.log(`Table ${i} created.`)
        } catch(e) {
            console.log(`table ${i} already exists.`)
            continue;
        }
    }
}

function connect(): Database{
    return new Database(db_path);
}

function create(db: Database, table: string, data: object) {
    let quote_wrapper = (lst: string[]) => {
        var wrapped_str: string = "";
        for(let i=0;i<lst.length;i++){
            wrapped_str += `'${lst[i]}',`;
        }
        return wrapped_str.substring(0,wrapped_str.length-1);
    }
    let keys = String(Object.keys(data));
    let values = quote_wrapper(Object.values(data));
    let cmd = `INSERT INTO ${table}(${keys}) VALUES (${values});`;
    db.run(cmd);
}

function read(
    db: Database,
    table: String,
    identifier: string,
    identifier_value: string,
    return_values: Array<String>
    ) {
    let val_str = String(return_values);
    let cmd = `SELECT (${val_str}) FROM ${table} WHERE ${identifier}='${identifier_value}'`;
    let query = db.query(cmd);
    return query.all()
}

initialize_db();



export {
    initialize_db, 
    create, 
    read, 
    connect
};