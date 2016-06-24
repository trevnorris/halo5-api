'use strict';

const fs = require('fs');
const https = require('https');

module.exports.httpsGetter = httpsGetter;
module.exports.printf = printf;
module.exports.resolveKey = resolveKey;


// All arguments are required.
function httpsGetter(options, callback) {
  const req = https.get(options, (res) => {
    var data = '';

    // Looking for the correct status codes.
    if (!(res.statusCode >= 200 && res.statusCode <= 202)) {
      req.abort();
      const err =
          new Error(`request failed ${res.statusCode} ${res.statusMessage}`);
      err.res = res;
      return callback(err);
    }

    // TODO(trevnorris): properly handle charset encodings don't assume utf8.
    res.on('data', (chunk) => data += chunk.toString());
    res.on('error', (err) => callback(err));
    res.on('end', () => callback(null, data));
  }).on('error', (err) => callback(err));
  return req;
}


// Resolve the Halo API key.
function resolveKey(keys) {
  if (typeof key !== 'string')
    key = process.env.NODE_SPARTAN_KEY;
  if (typeof key !== 'string')
    throw new Error('no halo api key provided');
  return key.trim();
}


// Right now simply print to stdout synchronously w/o automatic formatting.
// Currently a small number of formatting options are available:
//    %d - Print argument as a double
//    %.<n>d - Print double with <n> decimal digits
//    %i - Print argument as an int32
//    %u - Print argument as an uint32
//    %h - Print argument as an uint32 in base 16
//    %s - Print argument as a string
//    %% - Print %
function printf(str) {
  var retstr = '';
  var idx = 1;
  str.split(/(%[^%]*[diuhs%])/).forEach(item => {
    if (item.charAt(0) !== '%')
      retstr += item;
    else if (item === '%%')
      retstr += '%';
    else
      retstr += convertArg(item, arguments[idx++]);
  });
  fs.writeSync(1, retstr);
}


function convertArg(mod, val) {
  var arr;

  switch (mod) {
    case '%i':
      return val >> 0;
    case '%u':
      return val >>> 0;
    case '%h':
      return (val >>> 0).toString(16);
    case '%d':
      return +val;
    case '%s':
      return '' + val;
    case '%%':
      return '%';

    default:
      if (arr = mod.match(/^%\.([0-9]+)d$/)) {
        return (+val).toFixed(arr[1]);
      }
  };

  throw new Error(`unexpected arguments: ${mod}  ${val}`);
}
