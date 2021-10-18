import { autotestGet, autotestPost } from "@tim-code/autotest"
import { projectDir } from "./directory.js"
import { server } from "./server.js"

let remote
beforeAll((done) => {
  remote = server({ dirs: [`${projectDir}/test/routes`], port: 8080, done })
})
afterAll((done) => {
  remote.close(done)
})

const host = "http://localhost:8080"

autotestGet(`${host}/subdir/ping/ping`)()({
  result: "ping",
  success: true,
})

autotestGet(`${host}/unknown`)()({
  success: false,
  error: expect.objectContaining({ code: 404 }),
})

autotestGet(`${host}/..`, { name: "error invalid" })()({
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
