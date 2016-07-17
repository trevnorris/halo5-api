'use strict';

const util = require('./util');
const match_path = '/stats/h5/players/{player}/matches{modes}{start}{count}'

module.exports.getSpartanMatches = getSpartanMatches;


// Usage: getSpartanMatches(player, modes[, start[, count[, key]]], callback)
function getSpartanMatches(player, modes, start, count, key, callback) {
  if (typeof player !== 'string') {
    throw new TypeError('player must be a string');
  }
  if (typeof modes !== 'string' && !Array.isArray(modes)) {
    throw new TypeError('modes must be a string or array');
  } else if (Array.isArray(modes)) {
    modes = modes.join(',');
  }
  if (typeof start === 'function') {
    callback = start;
    start = 0;
  } else if (start === undefined) {
    start = 0;
  } else if (typeof start !== 'number') {
    throw new TypeError('start must be a number');
  }
  if (typeof count === 'function') {
    callback = count;
    count = 25;
  } else if (count === undefined) {
    count = 25;
  } else if (typeof count !== 'number') {
    throw new TypeError('count must be a number');
  }
  if (typeof key === 'function') {
    callback = key;
    key = undefined;
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  key = util.resolveKey(key);

  const arg_map = {
    '{player}': player,
    '{modes}': '?modes=' + modes,
    '{start}': '&start=' + start,
    '{count}': '&count=' + count,
  };
  const url_path = encodeURI(match_path.replace(/({\w+})/g, a => arg_map[a]));

  (function getMatches() {
    util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: url_path,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      if (err) {
        if (err.res && err.res.statusCode !== 429)
          return callback(err);
        // Too many requests made, try again later.
        setTimeout(getMatches, util.queryDelay());
      }

      let json;
      try {
        json = JSON.parse(data);
      } catch (e) {
        const err = new Error('json failed to parse');
        err.data = data;
        return callback(err);
      }

      callback(null, json);
    });
  }());
}
