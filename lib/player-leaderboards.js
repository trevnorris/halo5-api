'use strict';

const util = require('./util');

exports.getPlayerLeaderboard = getPlayerLeaderboard;


// Usage: getPlayerLeaderboard(seasonId, playlistId[, count], callback)
function getPlayerLeaderboard(seasonId, playlistId, count, callback) {
  if (typeof count === 'function') {
    callback = count;
    count = 200;
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

  const key = util.resolveKey();
  const api_path = '/stats/h5/player-leaderboards/csr/' +
                   `${seasonId}/${playlistId}?count=${count}`;

  util.generalizedStatGetter(key, api_path, callback);
}
