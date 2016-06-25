'use strict';

const util = require('./util');
const recordPath = '/stats/h5/servicerecords/warzone?players=';

module.exports.getWarzoneRecords = getWarzoneRecords;


// If members is String then suspect it to be a single spartan.
function getWarzoneRecords(members, key, callback) {
  const members_length = members.length;
  var ret_array = [];

  if (typeof key === 'function') {
    callback = key;
    key = undefined;
  }

  key = util.resolveKey(key);

  if (typeof members === 'string')
    members = [members];
  members = members.map(item => encodeURI(item.trim().toLowerCase()));

  // Array of https requests made. If one results in failure then the rest
  // should abort and not call the callback.
  const requests = [false];
  while (members.length > 0) {
    const req = util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: recordPath + members.splice(0, 15).join(','),
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      if (err) return callWithError(requests, req, err, callback);

      let json;
      try {
        json = JSON.parse(data);
      } catch (e) {
        const err = new Error('json failed to parse');
        err.data = data;
        err.url = url;
        return callWithError(requests, req, err, callback);
      }

      if (!Array.isArray(json.Results)) {
        const err = new Error('Results are not an Array');
        err.data = json;
        return callWithError(requests, req, err, callback);
      }
      ret_array = ret_array.concat(json.Results);
      if (ret_array.length >= members_length && !requests[0])
        callback(null, ret_array);
    });
    requests.push(req);
  }
}


function callWithError(requests, req, err, callback) {
  if (requests[0]) return;
  requests[0] = true;
  for (var i = 1; i < requests.length; i++) {
    requests[i].abort();
  }
  const idx = requests.indexOf(req);
  if (idx >= 0) requests.splice(idx, 1);
  callback(err);
}
