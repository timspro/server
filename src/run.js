import commandLineArgs from "command-line-args"
import { resolve } from "path"
import { server } from "./server.js"

const definitions = [
  { name: "headers", alias: "h", type: JSON.parse },
  { name: "port", alias: "p", type: Number },
  { name: "forbid", type: String },
  { name: "log", type: Boolean },
  { name: "static", type: resolve },
  { name: "routes", type: resolve, defaultOption: true },
]

const args = commandLineArgs(definitions)

// eslint-disable-next-line no-console
console.log("starting server with: ", args)

server(args)
