'use strict';

const util =  require('./util');
const debuglog = require('util').debuglog('halo5');
const record_path = '/stats/h5/servicerecords/arena?players=';

exports.getArenaServiceRecords = getArenaServiceRecords;


// If members is String then suspect it to be a single spartan.
// getArenaServiceRecords(members[, season], callback);
function getArenaServiceRecords(members, season, callback) {
  let ret_array = [];

  // First check that callback bubbles up correctly.
  if (typeof season === 'function') {
    callback = season;
    season = '';
  } else if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  // Now check that season is correct.
  if (typeof season !== 'string') {
    throw new TypeError('season must be a string');
  } else if (season.length > 0) {
    season = '&' + season;
  }

  const key = util.resolveKey();

  // Validate members, and encode all usernames.
  if (typeof members === 'string')
    members = [members];
  const members_length = members.length;
  members = members.map(item => encodeURI(item.trim()));

  // Array of https requests made. If one results in failure then the rest
  // should abort and not call the callback.
  const requests = [false];

  // Queue requests to be made at offset of key.delay() so the remote API
  // doesn't get overloaded.
  for (let i = 0; i < members.length; i++) {
    const query_members = members.splice(0, 32).join(',') + season;
    requests[i + 1] = setTimeout(function getData() {
      const req = util.httpsGetter({
        protocol: 'https:',
        hostname: 'www.haloapi.com',
        path: record_path + query_members,
        headers: {
          Host: 'www.haloapi.com',
          'Ocp-Apim-Subscription-Key': key,
        },
      }, (err, data) => {
        if (err) {
          if (!err.res) return callback(err);

          const statusCode = err.res.statusCode;
          debuglog(`error for request ${api_path} with code ${statusCode}`);

          if (err.res.statusCode !== 429)
            return util.callWithError(requests, err, callback);
          // Too many requests made, try again later.
          // Becaues requests has the extra [false], length - i is always > 0.
          return setTimeout(getData, (requests.length - i) * key.delay());
        }

        let json;
        try {
          json = JSON.parse(data);
        } catch (e) {
          const err = new Error('json failed to parse');
          err.data = data;
          return util.callWithError(requests, err, callback);
        }

        if (!Array.isArray(json.Results)) {
          const err = new Error('Results are not an Array');
          err.data = json;
          return util.callWithError(requests, err, callback);
        }
        ret_array = ret_array.concat(json.Results);
        if (ret_array.length >= members_length && !requests[0])
          callback(null, ret_array);
      });
      // Replace timer slot with new https request.
      requests[i + 1] = req;
    }, i * key.delay());
  }
}
