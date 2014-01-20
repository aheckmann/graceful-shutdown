
var E = require('events').EventEmitter;
var assert = require('assert');
var gs = require('../');

function server () {
  var s = new E;
  s.close = function() {
    setTimeout(function() {
      s.emit('close');
    }, 20);
  };
  return s;
};

describe('graceful-shutdown', function() {
  it('exports a function', function(done) {
    assert.equal('function', typeof gs);
    done();
  });

  it('can be called without `new`', function(done) {
    var g;
    assert.doesNotThrow(function() {
      g = gs();
    });
    assert.ok(g instanceof gs);
    done();
  });

  describe('#upon', function() {
    it('accepts a single event name', function(done) {
      var s = server();
      assert.doesNotThrow(function() {
        gs(s).upon('b');
      });
      done();
    });

    it('accepts a space delimited string of events', function(done) {
      var s = server();
      assert.doesNotThrow(function() {
        gs(s).upon('b c d');
      });
      done();
    });

    it('accepts an array of event names', function(done) {
      var s = server();
      var events = 'jump eat sleep'.split(' ');
      assert.doesNotThrow(function() {
        gs(s).upon(events);
      });
      done();
    });

    it('rejects non string/arrays', function(done) {
      var s = server();
      ;[null, undefined, Function, Date, {}, 4].forEach(function(item) {
        assert.throws(function() {
          gs(s).upon(item);
        });
      });
      done();
    });
  });

  describe('shutting-down event', function() {
    it('is emitted when the server is being closed', function(done) {
      var s = server();
      gs(s).upon('candy gum').on('shutting-down', function() {
        done();
      });
      process.emit('gum');
    });

    it('emits once regardless of how many times each source event fires', function(done) {
      var s = server();
      var called = 0;

      gs(s).upon('SIGCAKE SIGPIE SIGCOOKIE').on('shutting-down', function() {
        called++;
      });

      var closed = 0;
      s.on('close', function() {
        closed++;
      });

      process.emit('SIGCAKE');
      process.emit('SIGCOOKIE');
      process.emit('SIGPIE');
      process.emit('SIGPIE');
      process.emit('SIGTCAKE');

      setTimeout(function() {
        assert.equal(1, called);
        assert.equal(1, closed);
        done();
      }, 100);
    });
  });
});
