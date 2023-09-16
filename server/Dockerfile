FROM oven/bun

WORKDIR /app

COPY bun.lockb bun.lockb

COPY package.json package.json

RUN bun install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "bun", "run", "start" ]