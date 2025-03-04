import commandLineArgs from "command-line-args"
import { readFile } from "fs/promises"
import { resolve } from "path"
import { server } from "./server.js"

const args = commandLineArgs([
  { name: "headers", alias: "h", type: JSON.parse },
  { name: "headersPath", type: resolve },
  { name: "port", alias: "p", type: Number },
  { name: "forbid", type: String },
  { name: "log", type: Boolean },
  { name: "frontend", type: resolve },
  { name: "routes", type: resolve, defaultOption: true },
  { name: "postSize", type: String },
  { name: "host", type: String },
  { name: "expressRoute", type: Boolean },
  { name: "spa", type: String },
])

// eslint-disable-next-line no-console
console.log(new Date().toISOString(), "starting server with:", args)

if (args.headersPath) {
  readFile(args.headersPath).then((headers) =>
    server({ ...args, headers: JSON.parse(headers) })
  )
} else {
  server(args)
}
