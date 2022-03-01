import bodyParser from "body-parser"
import express from "express"
import morgan from "morgan"
import { resolve } from "path"
import sanitize from "sanitize-filename"

class PathError extends Error {}

function validate(path, forbid) {
  if (!path) {
    throw new PathError(`route path is empty`)
  }
  const matcher = new RegExp(forbid, "mu")
  const segments = path.split("/")
  for (const [index, segment] of segments.entries()) {
    if (!segment) {
      throw new PathError(`route path segment at index ${index} is empty`)
    }
    if (segment !== sanitize(segment)) {
      throw new PathError(`route path segment at index ${index} is invalid`)
    }
    if (forbid && matcher.test(segment)) {
      throw new PathError(`route path segment at index ${index} is forbidden`)
    }
  }
}

async function route(dir, path, args, forbid) {
  validate(path, forbid)
  const parts = path.split("/")
  const method = parts.pop()
  const relativeFilePath = parts.join("/")
  const module = await import(resolve(dir, `${relativeFilePath}.js`))
  return module[method](...args)
}

function sendError(response, status, message) {
  response.status(status).send({
    success: false,
    code: status,
    error: message,
  })
}

function handleRequest(dir, { forbid, expressRoute }) {
  return async (request, response) => {
    const { query, body } = request
    try {
      const path = request.path.slice(1)
      const args = expressRoute ? [request, response] : [{ ...body, ...query }]
      const result = await route(dir, path, args, forbid)
      if (!expressRoute) {
        response.json({ success: true, code: 200, result })
      }
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

function handleHeaders(headers) {
  return (request, response, next) => {
    response.set(headers)
    if (request.method === "OPTIONS") {
      response.send(200)
    } else {
      next()
    }
  }
}

export function server({
  headers,
  port,
  done,
  log,
  routes,
  frontend,
  spa,
  host = "localhost",
  forbid = "^_.*",
  expressRoute = false,
  postSize = undefined,
  routesUrlPath = "*",
  frontendUrlPath = "*",
}) {
  const app = express()

  app.use(handleHeaders(headers))

  if (log) {
    app.use(morgan(":date[iso] :method :url :status :res[content-length] - :response-time ms"))
  }

  app.use(bodyParser.urlencoded({ limit: postSize, extended: false }))

  app.use(bodyParser.json({ limit: postSize }))

  if (frontend) {
    app.use(frontendUrlPath, express.static(frontend, { redirect: false }))
    if (spa) {
      app.use(frontendUrlPath, (request, response) => {
        response.sendFile(spa)
      })
    }
  }

  // dynamically route other requests to "routes" folder
  if (routes) {
    app.use(routesUrlPath, handleRequest(routes, { forbid, expressRoute }))
  }

  // send errors as json
  // eslint-disable-next-line no-unused-vars
  app.use((error, request, response, next) => {
    console.error(error.stack)
    sendError(response, 500, error.message)
  })

  const result = app.listen(port, host, () => {
    if (log && !port) {
      // eslint-disable-next-line no-console
      console.log(`server listening on port: ${result.address().port}`)
    }
    if (done) {
      done()
    }
  })
  return result
}
