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
  result: "ping",
  success: true,
})

autotestGet(`${host}/unknown`, { name: "error unknown" })()({
  success: false,
  error: expect.objectContaining({ code: 404 }),
})

autotestGet(`${host}/..`, { name: "error invalid" })()({
  success: false,
  error: expect.objectContaining({ code: 400 }),
})
autotestGet(host, { name: "error root" })()({
  success: false,
  error: expect.objectContaining({ code: 400 }),
})
autotestGet(`${host}/helper`, { name: "error unknown" })()({
  success: false,
  error: expect.objectContaining({ code: 400 }),
})

const sameString = "test"
autotestGet(`${host}/subdir/ping/same`, { name: "get same" })({ input: sameString })({
  success: true,
  result: sameString,
})
autotestPost(`${host}/subdir/ping/same`, { name: "post same" })({ input: sameString })({
  success: true,
  result: sameString,
})
