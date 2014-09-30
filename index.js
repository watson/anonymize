'use strict';

var traverse = require('traverse');

module.exports = function Anonymize (options) {
  if (!options) return Anonymize({});
  if (typeof options === 'string') return Anonymize({ replacement: options });
  if (typeof options === 'function') return Anonymize({ replace: options });
  if (Array.isArray(options)) return Anonymize({ patterns: options });
  if (typeof options.replace === 'string') return Anonymize({ replacement: options.replace });

  if (options.patterns) options.patterns = options.patterns.map(function (pattern) {
    if (typeof pattern === 'string') return new RegExp(pattern, 'i');
    else return pattern;
  });

  var patterns = options.patterns || [/secret/i, /pass/i, /auth/i, /token/i];
  var totalPatterns = patterns.length;
  var replacement = options.replacement || '******';
  var replace = options.replace || function (key, val) {
    return replacement;
  };

  return function (obj) {
    return traverse(obj).map(function (val) {
      for (var i = 0; i < totalPatterns; i++) {
        if (!patterns[i].test(this.key)) continue;
        var newVal = replace(this.key, val);
        if (newVal === undefined) this.remove();
        else this.update(newVal);
        break;
      }
    });
  };
};
