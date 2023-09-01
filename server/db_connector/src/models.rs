use diesel::prelude::*;


#[derive(Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::mentors)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Mentor {
    username: String,
    name: String,
    password: String,
    private_key: String,
    public_key: String
}