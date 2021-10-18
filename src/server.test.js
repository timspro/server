import { autotestGet, autotestPost } from "@tim-code/autotest"
import { projectDir } from "./directory.js"
import { server } from "./server.js"

const port = 8089

let remote
beforeAll((done) => {
  remote = server({ dirs: [`${projectDir}/test/routes`], port, done, forbid: "helper" })
})
afterAll((done) => {
  remote.close(done)
})

const host = `http://localhost:${port}`

autotestGet(`${host}/subdir/ping/ping`)()({
  code: 200,
  success: true,
  result: "ping",
})

autotestGet(`${host}/unknown`, { name: "error unknown" })()(
  expect.objectContaining({
    success: false,
    code: 404,
  })
)

autotestGet(`${host}/..`, { name: "error invalid" })()(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)
autotestGet(host, { name: "error root" })()(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)
autotestGet(`${host}/helper`, { name: "error unknown" })()(
  expect.objectContaining({
    success: false,
    code: 400,
  })
)

const sameString = "test"
autotestGet(`${host}/subdir/ping/same`, { name: "get same" })({ input: sameString })({
  code: 200,
  success: true,
  result: sameString,
})
autotestPost(`${host}/subdir/ping/same`, { name: "post same" })({ input: sameString })({
  code: 200,
  success: true,
  result: sameString,
})
