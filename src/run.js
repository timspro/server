import { resolve } from "path"
import { server } from "./server.js"

const args = {
  headers: JSON.parse(process.env.HEADERS || "{}"),
  port: process.env.PORT,
  forbid: process.env.FORBID || "_.*",
  dirs: process.argv.slice(2).map((path) => resolve(path)),
}

// eslint-disable-next-line no-console
console.log("starting server with: ", args)

server(args)
