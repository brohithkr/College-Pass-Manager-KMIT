mod models;
mod schema;

use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use models::*;



pub fn connect() -> Result<SqliteConnection, ConnectionError> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
    .expect("Please set variable DATABASE_URL in environment or .env file.");

    SqliteConnection::establish(&database_url)
}


pub fn add_mentor(conn: &mut SqliteConnection,mentor: &Mentor) -> Result<usize, diesel::result::Error>  {
    use schema::mentors::dsl::*;
    diesel::insert_into(mentors)
    .values(mentor).execute(conn)
}

// fn get_data<T: Table>(conn: &mut SqliteConnection, table: T, filter: String) {

// }

