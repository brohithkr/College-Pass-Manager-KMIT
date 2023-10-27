import {Database} from "bun:sqlite";
import {Result} from "./types.ts";

// var db_path = (process.env.DOCKER) ? "DB/data.db" : "/DB/data.db";
var db_path = "DB/data.db";

export var schema: any = {
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
        issue_date integer,
        valid_till integer,
        pass_type varchar(15),
        b64_img text
    )
    `,
    "Lunch_Timings": `
    CREATE TABLE Lunch_Timings (
        year varchar(2) UNIQUE,
        opening_time varchar(7),
        closing_time varchar(7)
    )
    `,
    "latecomers": `
    CREATE TABLE latecomers (
        roll_no vachar(11),
        date integer
    )
    `
};

function initialize_db(table: string) {
    const db = new Database(db_path, {create: true});
    try{
        db.run(schema[table]);
        console.log(`Table ${table} created.`)
        if(table == "Lunch_Timings") {
            db.run(`INSERT INTO Lunch_Timings (year,opening_time,closing_time) VALUES ('1', '12:15', '13:00')`);
            db.run(`INSERT INTO Lunch_Timings (year,opening_time,closing_time) VALUES ('2', '12:15', '13:00')`);
            db.run(`INSERT INTO Lunch_Timings (year,opening_time,closing_time) VALUES ('3', '12:15', '13:00')`);
        }
    } catch(e) {
        // console.log(e)
        console.log(`table ${table} already exists.`)
    }
}

function connect(): Database{
    return new Database(db_path);
}

function create(db: Database, table: string, data: object)  {
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
    // console.log(`Data inserted into ${table}`);
    db.run(cmd);
    // try {
    //     db.run(cmd);
    // } catch(e) {
    //     console.log(e)
    //     if ((e as Error).message == "constraint failed") {
    //         var res: Result = {
    //             status: false,
    //             msg: `${(e as Error).message}`
    //         }
    //         return res
    //     }
    //     if ((e as Error).message.includes("no such table")) {
    //         initialize_db(table);
    //         db.run(cmd);
    //     }
    // }
    return res
}

function read(
    db: Database,
    table: string,
    identifier: string,
    identifier_value: string,
    return_values: Array<String>
    ) {
    let val_str = (return_values.length > 0) ? String(return_values) : "*";
    var cmd = `SELECT ${val_str} FROM ${table} WHERE ${identifier}='${identifier_value}'`;
    if (identifier_value == "*") {
        cmd = cmd.split("WHERE")[0];
    }
    let query = db.query(cmd);
    return query.all();
}

function update(
    db: Database,
    table: string,
    identifier: string,
    identifier_value: string,
    update_values: object
    ) {

    let val_arr = (Object.entries(update_values));
    
    var val_str = "";
    for( let i of val_arr) {
        // console.log(i);
        val_str += `${i[0]}='${i[1]}',`;
    }
    val_str = val_str.substring(0,val_str.length-1);
    // console.log(val_str);
    let cmd = `UPDATE ${table} SET ${val_str} WHERE ${identifier}='${identifier_value}'`;
    // console.log(cmd);
    db.run(cmd);
}

function delete_row(
    db: Database,
    table: String,
    identifier: string,
    identifier_value: string
    ) {
    let cmd = `DELETE FROM ${table} WHERE ${identifier}='${identifier_value}'`;
    let query = db.query(cmd);
    return query.all()
}


function disconnect(db: Database) {
    db.close();
}



export {
    initialize_db,
    create,
    read,
    connect,
    disconnect,
    update,
    delete_row,
};