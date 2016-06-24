'use strict';

const https = require('https');
const record_path = '/stats/h5/servicerecords/arena?players=';

module.exports.getArenaRecord = getArenaRecord;


// If members is String then suspect it to be a single spartan.
function getArenaRecord(members, callback) {
  // TODO(trevnorris)
  throw new Error('Getting arena records currently incomplete');

  const members_length = members.length;
  var ret_array = [];

  if (typeof process.env.NODE_SPARTAN_KEY !== 'string')
    throw new Error('no halo api key provided');

  const key = process.env.NODE_SPARTAN_KEY.trim();

  if (typeof members === 'string')
    members = [members];
  members = members.map(item => encodeURI(item.trim().toLowerCase()));

  while (members.length > 0) {
    const query_members = members.splice(0, 15).join(',');

    https.get({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: record_path + query_members,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (res) => {
      var data = '';

      if (res.statusCode > 200 && res.statusCode < 202) {
        return callback(
            new Error(`request failed ${res.statusCode} ${res.statusMessage}`));
      }

      res.on('data', chunk => data += chunk.toString());
      res.on('error', er => callback(er));
      res.on('end', () => {
        const json = JSON.parse(data);
        if (!Array.isArray(json.Results))
          return callback(new Error('Results was not an Array'));
        ret_array = ret_array.concat(json.Results);
        if (ret_array.length >= members_length)
          callback(null, ret_array);
      });
    }).on('error', er => callback(er));
  }
}
