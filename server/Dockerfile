FROM oven/bun
FROM rust

WORKDIR /app
COPY . .

WORKDIR /app/src/encryption
RUN cargo build


WORKDIR /app

RUN bun install

ENV PORT=3000

ENV DOCKER=true

EXPOSE 3000

RUN bun test

CMD [ "bun", "test"]