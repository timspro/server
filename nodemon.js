#!/usr/bin/env node

import nodemon from "nodemon"
import { dirname } from "path"
import { fileURLToPath } from "url"

// automatically watch the routes directory if specified
let watched = ""
const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--routes") {
    watched = `--watch ${args[i + 1]}`
    break
  }
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const scriptPath = `${scriptDir}/src/run.js`

nodemon(`${watched} ${scriptPath} ${args.join(" ")}`)

nodemon
  .on("quit", () => {
    process.exit()
  })
  .on("log", (event) => {
    // eslint-disable-next-line no-console
    console.log(event.colour)
  })
