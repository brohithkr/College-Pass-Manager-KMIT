FROM  oven/bun

WORKDIR /app

COPY . .

RUN bun install

RUN mkdir DB

RUN mkdir secrets
# RUN cp /app/src/encryption/target/debug/libencryption.so /app/

EXPOSE 3000

# CMD ["bun", "run", "start"]

CMD [ "python3", "-m", "http.server", "8000" ]