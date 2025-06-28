#!/usr/bin/env node

import nodemon from "nodemon"
import { parse } from "nodemon/lib/cli/index.js"
import { dirname } from "path"
import { fileURLToPath } from "url"

const argv = [...process.argv]

// automatically watch the routes directory if specified
for (let i = 2; i < argv.length; i++) {
  if (argv[i] === "--routes") {
    argv.push("--watch")
    argv.push(argv[i + 1])
    break
  }
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const script = `${scriptDir}/src/run.js`
argv.splice(2, 0, script)

nodemon(parse(argv))

nodemon
  .on("quit", () => {
    process.exit()
  })
  .on("log", (event) => {
    console.log(event.colour)
  })
