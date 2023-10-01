FROM fedora

RUN dnf update -y

RUN dnf install -y  python3 unzip curl openssl gcc openssl-devel perl

RUN curl -fsSL https://bun.sh/install | bash

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

ENV PATH="/root/.bun/bin:/root/.cargo/bin:${PATH}"

WORKDIR /app

COPY . .

RUN bun install

WORKDIR /app/src/encryption

RUN cargo build

WORKDIR /app

RUN cp /app/src/encryption/target/debug/libencryption.so /app/

EXPOSE 8000

CMD ["bun", "run", "start"]

# CMD [ "python3", "-m", "http.server", "8000" ]