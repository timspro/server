import bodyParser from "body-parser"
import express from "express"
import morgan from "morgan"
import { resolve } from "path"
import sanitize from "sanitize-filename"

class PathError extends Error {}

function validate(path, forbid) {
  const matcher = new RegExp(forbid, "mu")
  const segments = path.split("/")
  for (const [index, segment] of segments.entries()) {
    if (!segment) {
      throw new PathError(`path segment at index ${index} is empty`)
    }
    if (segment !== sanitize(segment)) {
      throw new PathError(`path segment at index ${index} is invalid`)
    }
    if (forbid && matcher.test(segment)) {
      throw new PathError(`path segment at index ${index} is forbidden`)
    }
  }
}

async function route(dir, path, args, forbid) {
  validate(path, forbid)
  const parts = path.split("/")
  const method = parts.pop()
  const relativeFilePath = parts.join("/")
  const module = await import(resolve(dir, `${relativeFilePath}.js`))
  return module[method](args)
}

function sendError(response, status, message) {
  response.status(status).send({
    success: false,
    code: status,
    error: message,
  })
}

function handle(dir, forbid) {
  return async (request, response) => {
    const { query, body } = request
    try {
      const path = request.path.slice(1)
      const args = { ...body, ...query }
      const result = await route(dir, path, args, forbid)
      response.json({ success: true, code: 200, result })
    } catch (error) {
      if (error instanceof PathError) {
        sendError(response, 400, error.message)
      } else if (error.code === "MODULE_NOT_FOUND" || error.code === "ERR_MODULE_NOT_FOUND") {
        sendError(response, 404, `could not find path: ${request.path}`)
      } else {
        throw error
      }
    }
  }
}

export function server({
  headers,
  port,
  done,
  log,
  routes = ".",
  static: staticDir,
  forbid = "^_.*",
}) {
  const app = express()

  app.use((request, response, next) => {
    response.set(headers)
    if (request.method === "OPTIONS") {
      response.send(200)
    } else {
      next()
    }
  })

  if (log) {
    app.use(morgan(":date[iso] :method :url :status :res[content-length] - :response-time ms"))
  }

  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(bodyParser.json())

  if (staticDir) {
    app.use(express.static(staticDir, { redirect: false }))
  }

  // dynamically route other requests to "routes" folder
  app.use(handle(routes, forbid))

  // send errors as json
  // eslint-disable-next-line no-unused-vars
  app.use((error, request, response, next) => {
    console.error(error)
    sendError(response, 500, error.message)
  })

  return app.listen(port, done)
}
