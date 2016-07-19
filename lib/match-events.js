'use strict';

const util = require('./util');

module.exports = {
  getEventsForMatch: getEventsForMatch,
  getEventsForMatchRaw: getEventsForMatchRaw,
};


function getEventsForMatch(matchId, callback) {
  getEventsForMatchRaw(matchId, function matchCallback(err, data) {
    // All err's that could have been handled, would have been handled.
    if (err) return callback(err);

    util.validateData(data, callback);
  });
}


function getEventsForMatchRaw(matchId, callback) {
  if (typeof matchId !== 'string')
    throw new TypeError('matchId must be a string');
  if (typeof callback !== 'function')
    throw new TypeError('callback must be a function');

  const key = util.resolveKey();
  const api_path = `/stats/h5/matches/${matchId}/events`;

  util.generalizedStatGetter(key, api_path, callback);
}
