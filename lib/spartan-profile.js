'use strict';

const util = require('./util');

module.exports = {
  getEmblemImage: getEmblemImage,
  getSpartanImage: getSpartanImage,
};

// Usage: getEmblemImage(spartan[, size], callback);
function getEmblemImage(spartan, size, callback) {
  if (typeof size === 'function') {
    callback = size;
    size = 256;
  }
  if (isNaN(size)) {
    throw new TypeError('size must be a number');
  } else {
    size = +size;
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  const key = util.resolveKey();
  spartan = encodeURI(spartan);
  const api_path = `/profile/h5/profiles/${spartan}/emblem?size=${size}`;

  (function getEmblem(tries) {
    util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: api_path,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      tries++;

      if (err && !err.res) return callback(err);

      const statusCode = err.res.statusCode;

      if (statusCode === 302) return callback(null, err.res.headers.location);
      if (statusCode === 429) return setTimeout(getEmblem, key.delay(), tries);

      callback(err);
    });
  }(0));
}


// Usage:
// getSpartanImage(spartan[, size[, crop]], callback);
function getSpartanImage(spartan, size, crop, callback) {
  if (typeof size === 'function') {
    callback = size;
    size = 256;
    crop = 'full';
  } else if (typeof crop === 'function') {
    callback = crop;
    crop = 'full';
  }

  if (isNaN(size)) {
    throw new TypeError('size must be a number');
  } else {
    size = +size;
  }

  if (crop !== 'full' && crop !== 'portrait') {
    throw new Error('crop must be "full" or "portrait"');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  const key = util.resolveKey();
  spartan = encodeURI(spartan);
  const api_path =
    `/profile/h5/profiles/${spartan}/emblem?size=${size}&crop=${crop}`;

  (function getSpartan(tries) {
    util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: api_path,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      tries++

      if (err && !err.res) return callback(err);

      const statusCode = err.res.statusCode;

      if (statusCode === 302) return callback(null, err.res.headers.location);
      if (statusCode === 429) return setTimeout(getSpartan, key.delay(), tries);

      callback(err);
    });
  }(0));
}
