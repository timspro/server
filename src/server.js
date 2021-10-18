import bodyParser from "body-parser"
import express from "express"
import morgan from "morgan"
import sanitize from "sanitize-filename"

class PathError extends Error {}

function validate(path) {
  const segments = path.split("/")
  for (const [index, segment] of segments.entries()) {
    if (!segment) {
      throw new PathError(`path segment at index ${index} is empty`)
    }
    if (segment !== sanitize(segment)) {
      throw new PathError(`path segment at index ${index} is invalid`)
    }
  }
}

async function route(dir, path, args) {
  validate(path)
  const parts = path.split("/")
  const method = parts.pop()
  const relativeFilePath = parts.join("/")
  const module = await import(`${dir}/${relativeFilePath}.js`)
  return module[method](args)
}

function sendError(response, status, message) {
  response.status(status).send({
    success: false,
    error: { code: status, message },
  })
}

function handle(dirs) {
  return async (request, response) => {
    const { query, body } = request
    let found = false
    for (const dir of dirs) {
      try {
        const path = request.path.slice(1)
        const args = { ...body, ...query, dir }
        // eslint-disable-next-line no-await-in-loop
        const result = await route(dir, path, args)
        response.json({ success: true, result })
        found = true
      } catch (error) {
        if (error instanceof PathError) {
          sendError(response, 400, error.message)
          return
        } else if (error.code !== "MODULE_NOT_FOUND") {
          throw error
        }
      }
    }
    if (!found) {
      sendError(response, 404, `could not find path: ${request.path}`)
    }
  }
}

export function server({ headers, port, dirs, done }) {
  const app = express()

  app.use((request, response, next) => {
    response.set(headers)

    if (request.method === "OPTIONS") {
      response.send(200)
    } else {
      next()
    }
  })

  app.use(morgan(":date[iso] :method :url :status :res[content-length] - :response-time ms"))

  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(bodyParser.json())

  // dynamically route other requests to "routes" folder
  app.use(handle(dirs))

  // send errors as json
  // eslint-disable-next-line no-unused-vars
  app.use((error, request, response, next) => {
    console.error(error)
    sendError(response, 500, error.message)
  })

  return app.listen(port, done)
}
