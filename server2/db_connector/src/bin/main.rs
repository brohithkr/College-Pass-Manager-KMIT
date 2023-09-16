#![allow(unused_variables)]
use db_connector::*;

fn main() {
    let conn = connect().unwrap_or_else(|e| panic!("{:?}",e));
    
    
}