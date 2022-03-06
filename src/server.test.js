import { autotest } from "@tim-code/autotest"
import { requestFactory } from "@tim-code/json-fetch"
import fetch from "node-fetch"
import { server } from "./server.js"

const request = requestFactory({ fetch, onError: ({ result }) => result })

const port = 8089

let remote
beforeAll((done) => {
  remote = server({
    routes: `test/routes`,
    port,
    done,
    forbid: "helper",
    frontend: `test/static`,
    headers: {
      "set-cookie": ["a=1", "b=2"],
    },
  })
})
afterAll((done) => {
  remote.close(done)
})

const host = `http://localhost:${port}`

autotest(request, { name: "ping" })(`${host}/subdir/ping/ping`)({
  code: 200,
  success: true,
  result: "ping",
})

autotest(request, { name: "error unknown" })(`${host}/unknown`)(
  expect.objectContaining({
    success: false,
    code: 404,
  })
)
autotest(request, { name: "error unknown unknown" })(`${host}/unknown/unknown`)(
  expect.objectContaining({
    success: false,
    code: 404,
  })
)

// express seems to do some coercion on path: "." and ".." are removed
autotest(request, { name: "error invalid" })(`${host}/*/test`)(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)
autotest(request, { name: "error forbidden" })(`${host}/helper/method`)(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)

const sameString = "test"
autotest(request, { name: "get same" })(`${host}/subdir/ping/same`, {
  query: { input: sameString },
})({
  code: 200,
  success: true,
  result: sameString,
})
autotest(request, { name: "post same" })(`${host}/subdir/ping/same`, {
  body: { input: sameString },
})({
  code: 200,
  success: true,
  result: sameString,
})

autotest(request, { name: "index.html" })(`${host}/index.html`, { raw: true })("test\n")
autotest(request, { name: "/" })(host, { raw: true })("test\n")

async function testHeaders() {
  const response = await fetch(`${host}/helper/method`)
  return response.headers.raw()
}
autotest(testHeaders)()(expect.objectContaining({ "set-cookie": ["a=1", "b=2"] }))
