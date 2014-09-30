# Anonymize

Anonymize values in an object based on property name patterns.

[![build status](https://secure.travis-ci.org/watson/anonymize.png)](http://travis-ci.org/watson/anonymize)

## Installation

```
npm install anonymize
```

## Basic usage

Let's say you want to anonymize the environment variables so that
passwords, tokens and other secrets are not exposed, in effect turning
this:

```javascript
{
  AWS_S3_KEY: 'BF73GVD903GFKSHFU2FJ',
  AWS_S3_SECRET: 'f6+ddWfgd2&dfbs3/dfgj&jkdbcds1234dsfgsss',
  DB_PASSWORD: 'FT^&*UHGFDRTYUJHVG',
  NODE_ENV: 'production'
}
```

Into this:

```javascript
{
  AWS_S3_KEY: 'BF73GVD903GFKSHFU2FJ',
  AWS_S3_SECRET: '******',
  DB_PASSWORD: '******',
  NODE_ENV: 'production'
}
```

You would simply:

```javascript
var anonymize = require('anonymize')();
var anonEnv = anonymize(process.env);
```

## Configuration

You can control both the patterns used to match the properties and the
replacement values.

By default properties containing the words `secret`, `pass`, `auth` or
`token` have their values replaced with `******`. The default patterns
are case insensitive.

Both the patterns and the replacement value can be individually
overridden by initializing the module with either an array of patterns
or a replacement string (or an options hash containing both an array of
patterns and a replacement value).

### Override patterns

Create an anonymizer that replaces the value of any property whos name
either contains `foo` or `bar`:

```javascript
// ['foo', 'bar'] is equivalent to [/foo/i, /bar/i]
var anonymize = require('anonymize')(['foo', 'bar']);
```

### Override replacement value

Create an anonymizer that replaces any property value with the string
`hidden`:

```javascript
var anonymize = require('anonymize')('hidden');
```

### Override both patterns and replacement value

Combine both custom patterns and a custom replacement string:

```javascript
var anonymize = require('anonymize')({
  patterns: ['foo', 'bar'],
  replace: 'hidden'
});
```

### Delete matched properties

If the replacement value is `undefined`, the property will be deleted
instead of having its value replaced.

### Conditional replacement

If you instead of a string for the replacement use a function, you can
control how a value is overwritten by conditionally returning the value
that should be used for overwriting.

```javascript
var anonymize = require('anonymize')({
  replace: function (key, val) {
    if (typeof val === 'number') return 0;
    return 'hidden';
  }
});
```

## Deeply nested objects

Yes, *anonymize* will also work on nested objects. So:

```javascript
{
  foo: { password: 'secret' },
  bar: [ { token: 'secret' }]
}
```

Will be correctly anonymized to:

```javascript
{
  foo: { password: '******' },
  bar: [ { token: '******' } ]
}
```

## License

MIT
