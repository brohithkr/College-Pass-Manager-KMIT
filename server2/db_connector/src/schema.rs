// @generated automatically by Diesel CLI.

diesel::table! {
    mentors (username) {
        username -> Text,
        name -> Text,
        password -> Text,
        private_key -> Text,
        public_key -> Text,
    }
}

diesel::table! {
    verifiers (username) {
        username -> Text,
        name -> Text,
        password -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    mentors,
    verifiers,
);
