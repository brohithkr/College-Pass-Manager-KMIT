FROM oven/bun
WORKDIR /app
# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
COPY . .
# RUN sh rustup.sh -y
RUN apt-get update && apt-get install -y curl
RUN sh rustup-init.sh -y
RUN source "$HOME/.cargo/env"
WORKDIR /app/src/encryption
RUN cargo build
# WORKDIR /app/src/encryption
# RUN
# RUN echo ${PATH}

# CMD ["cargo", "build"]

WORKDIR /app
RUN bun install

ENV PORT=3000

ENV DOCKER=true

EXPOSE 3000

CMD [ "bun", "test"]