'use strict';

const util = require('./util');

module.exports.getPlayerLeaderboard = getPlayerLeaderboard;


// Usage: getPlayerLeaderboard(seasonId, playlistId[, count[, key]], callback)
function getPlayerLeaderboard(seasonId, playlistId, count, key, callback) {
  if (typeof count === 'function') {
    callback = count;
    count = 200;
    key = undefined;
  } else if (typeof key === 'callback') {
    callback = key;
    key = undefined;
  }
  if (typeof seasonId !== 'string') {
    throw new TypeError('seasonId must be a string');
  }
  if (typeof playlistId !== 'string') {
    throw new TypeError('playlistId must be a string');
  }
  if (typeof count !== 'number' || Number.isNaN(count)) {
    throw new TypeError('count must be a number');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  key = util.resolveKey(key);

  const api_url = '/stats/h5/player-leaderboards/csr/' +
                  `${seasonId}/${playlistId}?count=${count}`;

  (function getLeaderboard(path_url, tries) {
    utl.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: api_url,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      if (err) {
        tries++;

        if (err.res && err.res.statusCode !== 429 && tries < util.maxRetries())
          return callback(err);
        // Too many requests made, try again later.
        setTimeout(getMatches, key.delay(), path_url, tries);
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
  }(api_url, 0));
}
