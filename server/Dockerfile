FROM rust

WORKDIR /app
COPY . .

WORKDIR /app/src/encryption
RUN cargo build

FROM oven/bun

COPY --from=0 /app/src/encryption/target/debug/libencryption.so /app/src/encryption/target/debug/libencryption.so

WORKDIR /app

COPY . .

RUN bun install

ENV PORT=3000

ENV DOCKER=true

EXPOSE 3000

RUN bun test

CMD [ "bun", "run", "start"]