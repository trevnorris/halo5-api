'use strict';

const fs = require('fs');
const https = require('https');
const zlib = require('zlib');

const timerConstructor = setTimeout(() => {}).constructor;

module.exports.httpsGetter = httpsGetter;
module.exports.resolveKey = resolveKey;
module.exports.callWithError = callWithError;
module.exports.queryDelay = queryDelay;
module.exports.isTimer = isTimer;
module.exports.printf = printf;


// All arguments are required.
function httpsGetter(options, callback) {
  const req = https.get(options, (res) => {
    const data = [];

    // Looking for the correct status codes.
    if (!(res.statusCode >= 200 && res.statusCode <= 202)) {
      req.abort();
      const err =
          new Error(`request failed ${res.statusCode} ${res.statusMessage}`);
      err.res = res;
      return callback(err);
    }

    res.on('data', (chunk) => data.push(chunk));
    res.on('error', (err) => callback(err));
    res.on('end', () => {
      // "buf" will be reassigned if Content-Encoding.
      var buf = data.length === 1 ? data[0] : Buffer.concat(data);
      const content_encoding = res.headers['content-encoding'];
      const content_type = res.headers['content-type'];

      // Fist check for Content-Encoding.
      if (content_encoding) {
        if (content_encoding === 'gzip')
          buf = zlib.unzipSync(buf);
        else if (content_encoding === 'deflate')
          buf = zlib.inflateSync(buf);
        else
          return callback(new Error(
              `content-encoding ${content_encoding} not recognized`));
      }

      if (typeof content_type !== 'string')
        return callback(null, buf.toString());

      const ct_norm =
          content_type.split(';')[1].split('=')[1].toLowerCase().trim();

      if (ct_norm === 'utf8' || ct_norm === 'utf-8')
        return callback(null, buf.toString());

      callback(new Error(`content-type ${content_type} not recognized`));
    });
  }).on('error', (err) => callback(err));
  return req;
}


// Resolve the Halo API key.
function resolveKey(key) {
  // First validate the key passed to the API.
  if (typeof key !== 'string') {
    if (key !== undefined)
      throw new TypeError('key must be a string');
    // Assign the key from env.
    key = process.env.HALO5_DEV_KEY;
  }

  // If there is no key in env then attempt to read in file from developer_key.
  if (key === undefined) {
    try {
      key = fs.readFileSync(__dirname + '/../developer_key').toString().trim();
    } catch (e) { }
  }

  // Check that either the HALO5_DEV_KEY env variable or developer_key were
  // set.
  if (typeof key !== 'string')
    throw new Error('no halo api key provided');
  // 32 is the Halo 5 dev API key length.
  if (key.length < 32 || key.length > 32)
    throw new Error('length of key is invalid');
  return key.trim();
}


// Abort remaining requests and call the callback with given error.
function callWithError(requests, err, callback) {
  if (requests[0]) return;
  requests[0] = true;
  for (let i = 1; i < requests.length; i++) {
    if (isTimer(requests[i]))
      clearTimeout(requests[i]);
    else
      requests[i].abort();
  }
  callback(err);
}


// Retrieve how much time should elapse between requests.
function queryDelay() {
  return +process.env.HALO5_QUERY_DELAY || 1200;
}


// Return whether an object is a a timer instance. This check is hosed if the
// user patches the return value for setTimeout().
function isTimer(val) {
  return val.constructor === timerConstructor;
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

