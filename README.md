# server

A wrapper around Express

```
npm install neptune-server
```

## CLI

The CLI of neptune-server is a wrapper around Nodemon

### Options

```js
{ name: "headers", alias: "h", type: JSON.parse },
{ name: "port", alias: "p", type: Number },
{ name: "forbid", type: String },
{ name: "log", type: Boolean },
{ name: "static", type: resolve },
{ name: "routes", type: resolve, defaultOption: true },
{ name: "postSize", type: String },
```

### Typical Usage

```
neptune-server --log --routes backend --watch package-lock.json
```

Note that `--routes` folder is automatically watched if specified.

If no `--port` is specified, then Node will randomly assign one. If `--log` is specified, a message including the port will be printed to the console in addition to the normal output logged.

By default, folders starting with `_` cannot be routed to due to the default value of `--forbid`.

### Serve Folder

```
neptune-server --frontend dist --port 4000
```

## Environment Variables

neptune-server does not make use of environment variables directly but code executed via the routes folder can make use of them.
