'use strict';

const util = require('./util');

module.exports.getArenaPostGame = returnPostGameFn('arena');
module.exports.getWarzonePostGame = returnPostGameFn('warzone');


function returnPostGameFn(type) {
  return function getPostGame(matchId, key, callback) {
    if (typeof key === 'function') {
      callback = key;
      key = undefined;
    }

    if (typeof matchId !== 'string')
      throw new TypeError('matchId must be a string');
    if (key && typeof key !== 'string')
      throw new TypeError('key must be a string');
    if (typeof callback !== 'function')
      throw new TypeError('callback must be a function');

    key = util.resolveKey(key);

    util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: '/stats/h5/' + type + '/matches/' + matchId,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      if (err) return callback(err);

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
  }
}