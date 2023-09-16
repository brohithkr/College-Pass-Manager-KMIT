let server = Bun.serve({
    fetch(req: Request) {
        return new Response("Hello Bun")!
    },
    port: process.env.PORT || 3000,
})

console.log(`Listening on http://localhost:${server.port}`)