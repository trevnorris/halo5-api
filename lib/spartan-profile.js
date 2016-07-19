'use strict';

const util = require('./util');

module.exports.getEmblemImage = getEmblemImage;
module.exports.getSpartanImage = getSpartanImage;

// Usage:
// getEmblemImage(spartan[, size[, key]], callback);
function getEmblemImage(spartan, size, key, callback) {
  if (typeof size === 'function') {
    callback = size;
    size = 256;
    key = undefined;
  } else if (typeof key === 'function') {
    callback = key;
    key = undefined;
  }

  if (isNaN(size)) {
    throw new TypeError('size must be a number');
  } else {
    size = +size;
  }

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  key = util.resolveKey(key);
  spartan = encodeURI(spartan);

  util.httpsGetter({
    protocol: 'https:',
    hostname: 'www.haloapi.com',
    path: `/profile/h5/profiles/${spartan}/emblem?size=${size}`,
    headers: {
      Host: 'www.haloapi.com',
      'Ocp-Apim-Subscription-Key': key,
    },
  }, (err, data) => {
    if (err.res.statusCode === 302)
      return callback(null, err.res.headers.location);
    // Check for 429 even when it's a single request?
    callback(err);
  });
}


// Usage:
// getSpartanImage(spartan[, size[, crop[, key]]], callback);
function getSpartanImage(spartan, size, crop, key, callback) {
  if (typeof size === 'function') {
    callback = size;
    size = 256;
    crop = 'full';
    key = undefined;
  } else if (typeof crop === 'function') {
    callback = crop;
    crop = 'full';
    key = undefined;
  } else if (typeof key === 'function') {
    callback = key;
    key = undefined;
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

  key = util.resolveKey(key);
  spartan = encodeURI(spartan);

  util.httpsGetter({
    protocol: 'https:',
    hostname: 'www.haloapi.com',
    path: `/profile/h5/profiles/${spartan}/emblem?size=${size}&crop=${crop}`,
    headers: {
      Host: 'www.haloapi.com',
      'Ocp-Apim-Subscription-Key': key,
    },
  }, (err, data) => {
    if (err.res.statusCode === 302)
      return callback(null, err.res.headers.location);

    // XXX: Check for 429 even when it's a single request?
    // XXX: What happens if no err?
    callback(err);
  });
}
