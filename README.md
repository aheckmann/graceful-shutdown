#graceful-shutdown

Shuts down an `HTTP{s}Server` gracefully upon the first specified signal received by the process and executes the optional callback.

### example

```js
var gracefullyShutdown = require('graceful-shutdown');

var server = http.createServer();

gracefullyShutdown(server).upon('SIGINT SIGTERM').finally(function() {
  console.log('I am an optional callback');
  console.log('server#close() has been called');
});
```

### install

```
> npm install graceful-shutdown
```

### License

MIT
