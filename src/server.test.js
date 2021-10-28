import { autotest } from "@tim-code/autotest"
import * as json from "@tim-code/json-fetch"
import fetch from "node-fetch"
import { server } from "./server.js"

global.fetch = fetch
const onError = { onError: ({ result }) => result }

const port = 8089

let remote
beforeAll((done) => {
  remote = server({
    routes: `test/routes`,
    port,
    done,
    forbid: "helper",
    static: `test/static`,
  })
})
afterAll((done) => {
  remote.close(done)
})

const host = `http://localhost:${port}`

autotest(json.request, { name: "ping" })(`${host}/subdir/ping/ping`)({
  code: 200,
  success: true,
  result: "ping",
})

autotest(json.request, { name: "error unknown" })(`${host}/unknown`, onError)(
  expect.objectContaining({
    success: false,
    code: 404,
  })
)
autotest(json.request, { name: "error unknown unknown" })(`${host}/unknown/unknown`, onError)(
  expect.objectContaining({
    success: false,
    code: 404,
  })
)

// express seems to do some coercion on path: "." and ".." are removed
autotest(json.request, { name: "error invalid" })(`${host}/*/test`, onError)(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)
autotest(json.request, { name: "error forbidden" })(`${host}/helper/method`, onError)(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)

const sameString = "test"
autotest(json.get, { name: "get same" })(`${host}/subdir/ping/same`, { input: sameString })({
  code: 200,
  success: true,
  result: sameString,
})
autotest(json.post, { name: "post same" })(`${host}/subdir/ping/same`, { input: sameString })({
  code: 200,
  success: true,
  result: sameString,
})

autotest(json.request, { name: "index.html" })(`${host}/index.html`, { raw: true })("test\n")
autotest(json.request, { name: "/" })(host, { raw: true })("test\n")
