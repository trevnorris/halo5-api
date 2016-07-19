'use strict';

const util = require('./util');

module.exports.getArenaPostGame = returnPostGameFn('arena');
module.exports.getWarzonePostGame = returnPostGameFn('warzone');
module.exports.getCustomPostGame = returnPostGameFn('custom');
module.exports.getCampaignPostGame = returnPostGameFn('campaign');


function returnPostGameFn(type) {
  return function getPostGame(matchId, callback) {
    if (typeof matchId !== 'string')
      throw new TypeError('matchId must be a string');
    if (typeof callback !== 'function')
      throw new TypeError('callback must be a function');

    const key = util.resolveKey();
    const api_path = `/stats/h5/${type}/matches/${matchId}`;

    util.generalizedStatGetter(key, api_path, callback);
  }
}
