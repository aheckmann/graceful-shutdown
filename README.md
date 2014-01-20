#graceful-shutdown

Shuts down a `Server` gracefully upon the first specified signal received by the process and executes the optional callback.

### example

```js
var gracefullyShutdown = require('graceful-shutdown');

var server = http.createServer();

gracefullyShutdown(server).upon('SIGINT SIGTERM').on('shutting-down', function() {
  console.log('server#close() has been called');
});
```

### documentation

#### constructor
`graceful-shutdown` exports a single constructor. It may be called with or without the `new` keyword.

```js
var GracefulShutdown = require('graceful-shutdown');

// these are the same:
var gs = GracefulShutdown(server);
var gs = new GracefulShutdown(server);
```

The constructor accepts a single `net.Server` instance.

#### GracefulShutdown#upon()

Accepts either a space delimited list of events or an array of event names. Listeners for these events will be added to the `process`. Once any one of these events are emitted on the `process`, `server.close()` will be executed, and all registered event listeners will be removed.

```js
// these are the same
var gs = GracefulShutdown(server).upon('SIGTERM SIGINT');
var gs = GracefulShutdown(server).upon(['SIGTERM', 'SIGINT']);
```

#### Events

The GracefulShutdown instance will emit a `shutting-down` event when `server.close()` has been called.
Note, this is not a listener for the [server close](http://nodejs.org/api/net.html#net_server_close_callback) event. If you want to listen for the server `close` event you must add the listener yourself.

```js
GracefulShutdown(server).upon('SIGTERM SIGINT').on('shutting-down', function() {
  console.log('server.close() has been called');
});

server.on('close', console.log.bind(console, 'the server is closed'));
```

An alternative way to register a callback for the `shutting-down` event is to pass it as the second argument to GracefulShutdown.

```js
GracefulShutdown(server, callback).upon('SITERM SIGINT');
```

### install

```
npm install graceful-shutdown
```

### License

MIT
