
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

  describe('#finally', function() {
    it('assigns a callback to execute when the server is closed', function(done) {
      var s = server();
      gs(s).upon('candy gum').finally(function() {
        done();
      });
      process.emit('gum');
    });

    it('callback is only executed once regardless of how many times each event fires', function(done) {
      var s = server();
      var called = 0;

      gs(s).upon('SIGCAKE SIGPIE SIGCOOKIE').finally(function() {
        called++;
      });

      process.emit('SIGCAKE');
      process.emit('SIGCOOKIE');
      process.emit('SIGPIE');
      process.emit('SIGPIE');
      process.emit('SIGTCAKE');

      assert.equal(1, called);
      done();
    });
  });
});
