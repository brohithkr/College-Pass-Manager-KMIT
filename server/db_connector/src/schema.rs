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
