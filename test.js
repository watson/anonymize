'use strict';

var test = require('tape');
var Anonymize = require('./');

var obj = {
  foo: 'ok',
  someSecret: 'secret',
  somePass: 'secret',
  someAuth: 'secret',
  someToken: 'secret',
  sub: {
    bar: 'ok',
    anotherSecret: 'secret'
  },
  arr: [ 'ok', { anotherToken: 'secret' } ]
};

test('Anonymize() should anonymize default patterns with default value', function (t) {
  var anonymize = Anonymize();
  var expected = {
    foo: 'ok',
    someSecret: '******',
    somePass: '******',
    someAuth: '******',
    someToken: '******',
    sub: {
      bar: 'ok',
      anotherSecret: '******'
    },
    arr: [ 'ok', { anotherToken: '******' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize(\'hidden\') should anonymize default patterns with custom value', function (t) {
  var anonymize = Anonymize('hidden');
  var expected = {
    foo: 'ok',
    someSecret: 'hidden',
    somePass: 'hidden',
    someAuth: 'hidden',
    someToken: 'hidden',
    sub: {
      bar: 'ok',
      anotherSecret: 'hidden'
    },
    arr: [ 'ok', { anotherToken: 'hidden' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize(fn) should anonymize default patterns with function return-value', function (t) {
  var anonymize = Anonymize(function (key, val) {
    return 'hidden';
  });
  var expected = {
    foo: 'ok',
    someSecret: 'hidden',
    somePass: 'hidden',
    someAuth: 'hidden',
    someToken: 'hidden',
    sub: {
      bar: 'ok',
      anotherSecret: 'hidden'
    },
    arr: [ 'ok', { anotherToken: 'hidden' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize([...]) should anonymize custom patterns with default value', function (t) {
  var anonymize = Anonymize(['FOO', /pass/i]);
  var expected = {
    foo: '******',
    someSecret: 'secret',
    somePass: '******',
    someAuth: 'secret',
    someToken: 'secret',
    sub: {
      bar: 'ok',
      anotherSecret: 'secret'
    },
    arr: [ 'ok', { anotherToken: 'secret' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize({ patterns: [...] }) should anonymize custom patterns with default value', function (t) {
  var anonymize = Anonymize({ patterns: ['FOO', /pass/i] });
  var expected = {
    foo: '******',
    someSecret: 'secret',
    somePass: '******',
    someAuth: 'secret',
    someToken: 'secret',
    sub: {
      bar: 'ok',
      anotherSecret: 'secret'
    },
    arr: [ 'ok', { anotherToken: 'secret' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize({ replacement: \'hidden\' }) should anonymize default patterns with custom value', function (t) {
  var anonymize = Anonymize({ replacement: 'hidden' });
  var expected = {
    foo: 'ok',
    someSecret: 'hidden',
    somePass: 'hidden',
    someAuth: 'hidden',
    someToken: 'hidden',
    sub: {
      bar: 'ok',
      anotherSecret: 'hidden'
    },
    arr: [ 'ok', { anotherToken: 'hidden' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize({ replace: fn }) should anonymize default patterns with function return-value', function (t) {
  var anonymize = Anonymize({ replace: function (key, val) {
    return 'hidden';
  } });
  var expected = {
    foo: 'ok',
    someSecret: 'hidden',
    somePass: 'hidden',
    someAuth: 'hidden',
    someToken: 'hidden',
    sub: {
      bar: 'ok',
      anotherSecret: 'hidden'
    },
    arr: [ 'ok', { anotherToken: 'hidden' } ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});

test('Anonymize({ replace: => undefined }) should delete default patterns', function (t) {
  var anonymize = Anonymize({ replace: function (key, val) {
    return undefined;
  } });
  var expected = {
    foo: 'ok',
    sub: { bar: 'ok' },
    arr: [ 'ok', {} ]
  };
  t.deepEqual(anonymize(obj), expected);
  t.end();
});
