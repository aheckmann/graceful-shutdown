'use strict';

var onceUpon = require('once-upon');
var debug = require('debug')('graceful-shutdown');

module.exports = exports = GracefulShutdown;

/**
 * Gracefully shuts down `server` when the process receives
 * the passed signals and logs a message using the server
 * `name`.
 *
 * @param {HTTPServer} server
 * @param {Function} [cb] optional callback that executes when shutting down
 */

function GracefulShutdown (server, cb) {
  if (!(this instanceof GracefulShutdown)) {
    return new GracefulShutdown(server, cb);
  }

  this.server = server;
  this.cb = cb;
};

/**
 * Listens for `signals` emitted on the `process` to
 * trigger a graceful shutdown of the server.
 *
 * @param {Array|String} signals
 */

GracefulShutdown.prototype.upon = function upon (signals) {
  onceUpon(signals, process, this._shutdown.bind(this));
  return this;
};

/**
 * Sets the callback to call upon shutdown.
 *
 * @param {Function} cb
 */

GracefulShutdown.prototype.finally = function (cb) {
  this.cb = cb;
  return this;
};

/*!
 * Shuts down the server gracefully and executes our cb
 *
 * @api private
 */

GracefulShutdown.prototype._shutdown = function _shutdown () {
  debug('_shutdown');
  this.server.close();
  if (this.cb) this.cb();
};

