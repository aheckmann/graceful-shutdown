'use strict';

var onceUpon = require('once-upon');
var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
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
  if (cb) this.on('shutting-down', cb);
};

/*!
 * Inherit from EventEmitter
 */

inherits(GracefulShutdown, Emitter);

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

/*!
 * Shuts down the server gracefully and executes our cb
 *
 * @api private
 */

GracefulShutdown.prototype._shutdown = function _shutdown () {
  debug('_shutdown');
  this.server.close();
  this.emit('shutting-down');
};

