'use strict';

const util = require('./util');
const recordPath = '/stats/h5/servicerecords/warzone?players=';

module.exports.getWarzoneRecords = getWarzoneRecords;


// If members is String then suspect it to be a single spartan.
function getWarzoneRecords(members, key, callback) {
  let ret_array = [];

  if (typeof key === 'function') {
    callback = key;
    key = undefined;
  }
  if (typeof callback !== 'function') {
    throw TypeError('callback must be a function');
  }

  // Now validate a correct key.
  key = util.resolveKey(key);

  // Validate members, and encode all usernames.
  if (typeof members === 'string')
    members = [members];
  if (!Array.isArray(members))
    throw new TypeError('members must be a string or array');
  const members_length = members.length;
  members = members.map(item => encodeURI(item.trim()));

  // Array of https requests made. If one results in failure then the rest
  // should abort and not call the callback.
  const requests = [false];

  for (let i = 0; i < members.length; i++) {
    const query_members = members.splice(0, 32).join(',');
    requests[i + 1] = setTimeout(function getData() {
      const req = util.httpsGetter({
        protocol: 'https:',
        hostname: 'www.haloapi.com',
        path: recordPath + query_members,
        headers: {
          Host: 'www.haloapi.com',
          'Ocp-Apim-Subscription-Key': key,
        },
      }, (err, data) => {
        if (err) {
          if (!err.res && err.res.statusCode !== 429)
            return util.callWithError(requests, err, callback);
          // Too many requests made, try again later.
          // Becaues requests has the extra [false], length - i is always > 0.
          return setTimeout(getData, (requests.length - i) * delay);
        }

        let json;
        try {
          json = JSON.parse(data);
        } catch (e) {
          const err = new Error('json failed to parse');
          err.data = data;
          err.url = url;
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
    }, i * util.queryDelay());
  }
}
