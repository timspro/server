#!/usr/bin/env node

import nodemon from "nodemon"
import { dirname } from "path"
import { fileURLToPath } from "url"

const args = process.argv.slice(2)

// automatically watch the routes directory if specified
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--routes") {
    args.push("--watch")
    args.push(args[i + 1])
    break
  }
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const script = `${scriptDir}/src/run.js`

nodemon({ script, args })

nodemon
  .on("quit", () => {
    process.exit()
  })
  .on("log", (event) => {
    // eslint-disable-next-line no-console
    console.log(event.colour)
  })
