#![allow(
    non_camel_case_types,
    unused,
    clippy::redundant_closure,
    clippy::useless_conversion,
    clippy::unit_arg,
    clippy::double_parens,
    non_snake_case,
    clippy::too_many_arguments
)]
// AUTO GENERATED FILE, DO NOT EDIT.
// Generated by `flutter_rust_bridge`@ 1.82.1.

use crate::api::*;
use core::panic::UnwindSafe;
use flutter_rust_bridge::rust2dart::IntoIntoDart;
use flutter_rust_bridge::*;
use std::ffi::c_void;
use std::sync::Arc;

// Section: imports

// Section: wire functions

fn wire_rsa_generate_impl(port_: MessagePort) {
    FLUTTER_RUST_BRIDGE_HANDLER.wrap::<_, _, _, (String, String), _>(
        WrapInfo {
            debug_name: "rsa_generate",
            port: Some(port_),
            mode: FfiCallMode::Normal,
        },
        move || move |task_callback| Result::<_, ()>::Ok(rsa_generate()),
    )
}
fn wire_rsa_encrypt_impl(
    port_: MessagePort,
    private_key_pem: impl Wire2Api<String> + UnwindSafe,
    data: impl Wire2Api<String> + UnwindSafe,
) {
    FLUTTER_RUST_BRIDGE_HANDLER.wrap::<_, _, _, String, _>(
        WrapInfo {
            debug_name: "rsa_encrypt",
            port: Some(port_),
            mode: FfiCallMode::Normal,
        },
        move || {
            let api_private_key_pem = private_key_pem.wire2api();
            let api_data = data.wire2api();
            move |task_callback| Result::<_, ()>::Ok(rsa_encrypt(api_private_key_pem, api_data))
        },
    )
}
fn wire_rsa_decrypt_impl(
    port_: MessagePort,
    public_key_pem: impl Wire2Api<String> + UnwindSafe,
    endata: impl Wire2Api<String> + UnwindSafe,
) {
    FLUTTER_RUST_BRIDGE_HANDLER.wrap::<_, _, _, String, _>(
        WrapInfo {
            debug_name: "rsa_decrypt",
            port: Some(port_),
            mode: FfiCallMode::Normal,
        },
        move || {
            let api_public_key_pem = public_key_pem.wire2api();
            let api_endata = endata.wire2api();
            move |task_callback| Result::<_, ()>::Ok(rsa_decrypt(api_public_key_pem, api_endata))
        },
    )
}
fn wire_add_impl(
    port_: MessagePort,
    left: impl Wire2Api<usize> + UnwindSafe,
    right: impl Wire2Api<usize> + UnwindSafe,
) {
    FLUTTER_RUST_BRIDGE_HANDLER.wrap::<_, _, _, usize, _>(
        WrapInfo {
            debug_name: "add",
            port: Some(port_),
            mode: FfiCallMode::Normal,
        },
        move || {
            let api_left = left.wire2api();
            let api_right = right.wire2api();
            move |task_callback| Result::<_, ()>::Ok(add(api_left, api_right))
        },
    )
}
// Section: wrapper structs

// Section: static checks

// Section: allocate functions

// Section: related functions

// Section: impl Wire2Api

pub trait Wire2Api<T> {
    fn wire2api(self) -> T;
}

impl<T, S> Wire2Api<Option<T>> for *mut S
where
    *mut S: Wire2Api<T>,
{
    fn wire2api(self) -> Option<T> {
        (!self.is_null()).then(|| self.wire2api())
    }
}

impl Wire2Api<u8> for u8 {
    fn wire2api(self) -> u8 {
        self
    }
}

impl Wire2Api<usize> for usize {
    fn wire2api(self) -> usize {
        self
    }
}
// Section: impl IntoDart

// Section: executor

support::lazy_static! {
    pub static ref FLUTTER_RUST_BRIDGE_HANDLER: support::DefaultHandler = Default::default();
}

/// cbindgen:ignore
#[cfg(target_family = "wasm")]
#[path = "bridge_generated.web.rs"]
mod web;
#[cfg(target_family = "wasm")]
pub use web::*;

#[cfg(not(target_family = "wasm"))]
#[path = "bridge_generated.io.rs"]
mod io;
#[cfg(not(target_family = "wasm"))]
pub use io::*;
