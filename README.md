# server

```
npm install @tim-code/server
```

A wrapper around Express that exposes commonly used functionality to a CLI

## CLI

The CLI of `server` is a wrapper around Nodemon

### Options

```js
const args = commandLineArgs([
  { name: "headers", alias: "h", type: JSON.parse },
  { name: "headersPath", type: resolve },
  { name: "port", alias: "p", type: Number },
  { name: "forbid", type: String },
  { name: "log", type: Boolean },
  { name: "frontend", type: resolve },
  { name: "routes", type: resolve, defaultOption: true },
  { name: "postSize", type: String },
  { name: "host", type: String },
  { name: "expressRoute", type: Boolean },
  { name: "spa", type: String },
])
```

### Typical Usage

```
server --log --routes backend --watch package-lock.json
```

Note that `--routes` folder is automatically watched if specified.

If no `--port` is specified, then Node will randomly assign one. If `--log` is specified, a message including the port will be printed to the console in addition to the normal output logged.

By default, folders starting with `_` cannot be routed to due to the default value of `--forbid`.

### Serve Folder

```
server --frontend dist --port 4000
```

## Environment Variables

server does not make use of environment variables directly but code executed via the routes folder can make use of them.
