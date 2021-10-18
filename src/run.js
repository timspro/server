import { resolve } from "path"
import { server } from "./server.js"

const args = {
  hostname: process.argv[2],
  port: process.argv[3],
  dirs: process.argv.slice(4).map((path) => resolve(path)),
}

// eslint-disable-next-line no-console
console.log("starting server with: ", args)

server(args)
