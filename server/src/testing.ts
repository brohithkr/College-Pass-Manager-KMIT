import { CString, ptr, dlopen, FFIType, suffix } from "bun:ffi";

const path = `/home/rohith/Documents/myProjects/College-Pass-Manager-KMIT/server/src/encryption/testing/target/debug/libtesting.${suffix}`;
console.log(path)

let libtesting = dlopen (
    path,{
        add: {
            args: [FFIType.i64, FFIType.i64],
            returns: FFIType.cstring
        },

    }
)

const get_cstring = (s: string) => {
    let enc = new TextEncoder();
    let b = enc.encode(s);
    let p = ptr(b);
    return new CString(p);
}

let enc = new TextEncoder();

let left = ptr(enc.encode("Hello")) as number;
let right = ptr(enc.encode("World")) as number;

console.log(enc.encode("Hello"),right);

console.log(libtesting.symbols.add(left,right));