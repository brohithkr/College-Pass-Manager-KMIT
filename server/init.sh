if ! type cargo > /dev/null; then
    echo "Found not cargo"
    echo "Installing cargo"
    curl curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

    export PATH="$HOME/.cargo/bin:${PATH}"
fi

if ! type bun > /dev/null; then
    echo "Found not bun"
    echo "Installing bun"
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:${PATH}"
fi

bun install

cd ./src/encryption

cargo build 

cd ../..

mkdir DB

bun run start
 