'use strict';

const util = require('./util');
const match_path = '/stats/h5/players/{player}/matches{modes}{start}{count}'

exports.getSpartanMatches = getSpartanMatches;


// Usage: getSpartanMatches(player, modes[, start[, count]], callback)
function getSpartanMatches(player, modes, start, count, callback) {
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
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  const key = util.resolveKey();

  const arg_map = {
    '{player}': player,
    '{modes}': '?modes=' + modes,
    '{start}': '&start=' + start,
    '{count}': '&count=' + count,
  };
  const api_path = encodeURI(match_path.replace(/({\w+})/g, a => arg_map[a]));

  util.generalizedStatGetter(key, api_path, callback);
}
