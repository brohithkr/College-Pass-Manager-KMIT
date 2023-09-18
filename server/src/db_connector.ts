import {Database} from "bun:sqlite";

// import {Verifier} from "./types.ts";

// var db_path = (process.env.DOCKER) ? "DB/data.db" : "/DB/data.db";
var db_path = "DB/data.db";

function initialize_db() {
    const db = new Database(db_path, {create: true});
    let schema = {
        "Verifier": `
        CREATE TABLE Verifier (
            uid varchar(30),
            name varchar(50),
            passwd varchar(30)
        )
        `,
        "Pass": `
            roll_no varchar(11),
            issue_date varchar(10),
            valid_till varchar(10),
            pass_type varchar(15),
            b64_img text
        `
    }
}

function connect(){
    db 
}

function create(db: Database, table: string, data: object) {
    let keys = String(Object.keys(data));
    let values = String(Object.values(data));
    let cmd = `INSERT INTO ${table}(${keys}) VALUES (${values})`;
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
    let cmd = `SELECT (${val_str}) FROM ${table} WHERE ${identifier}=${identifier_value}`;
    let query = db.query(cmd);
    return query.all()
}