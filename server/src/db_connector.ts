import {Database} from "bun:sqlite";
import { expect } from "bun:test";

import {Result} from "./types.ts";

// var db_path = (process.env.DOCKER) ? "DB/data.db" : "/DB/data.db";
var db_path = "DB/data.db";

function initialize_db(table: string) {
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
        `,
    };
    try{
        db.run(schema[table]);
        console.log(`Table ${table} created.`)
    } catch(e) {
        console.log(`table ${table} already exists.`)
    }
}

function connect(): Database{
    return new Database(db_path);
}

function create(db: Database, table: string, data: object): Result  {
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

    var res: Result = {
        status: true,
        msg: "Data creation successful "
    }
    try {
        db.run(cmd);
        
    } catch(e) {
        if ((e as Error).message == "constraint failed") {
            var res: Result = {
                status: false,
                msg: `${(e as Error).message}`
            }
            return res
        }
        if ((e as Error).message.includes("no such table")){
            initialize_db(table);
            db.run(cmd);
        }
    }
    return res
    
}

function read(
    db: Database,
    table: String,
    identifier: string,
    identifier_value: string,
    return_values: Array<String>
    ) {
    let val_str = String(return_values);
    let cmd = `SELECT ${val_str} FROM ${table} WHERE ${identifier}='${identifier_value}'`;
    console.log(cmd);
    let query = db.query(cmd);
    return query.all()
}




export {
    initialize_db,
    create,
    read,
    connect
};