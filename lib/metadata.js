'use strict';

const util = require('./util');
const metadata = {};

module.exports.metadata = metadata;

// XXX These have {id}
const game_variants_path = '/metadata/h5/metadata/game-variants/{id}';
const map_variants_path = '/metadata/h5/metadata/map-variants/{id}';
const req_packs_path = '/metadata/h5/metadata/requisition-packs/{id}';
const requisitions = '/metadata/h5/metadata/requisitions/{id}';


// Majority of metadata information can be easily templatized.
[
  'campaign-missions',
  'commendations',
  'csr-designations',
  'enemies',
  'flexible-stats',
  'game-base-variants',
  'impulses',
  'maps',
  'medals',
  'playlists',
  'seasons',
  'skulls',
  'spartan-ranks',
  'team-colors',
  'vehicles',
  'weapons',
].forEach((i) => {
  const name = i.split('-').map(
      a => a.charAt(0).toUpperCase() + a.substr(1)).join('');
  metadata['get' + name] = metaGetter('/metadata/h5/metadata/' + i);
});


// This is the metadata that requires an id.
[
  'game-variants',
  'map-variants',
  'requisition-packs',
  'requisitions',
].forEach((i) => {
  const name = i.split('-').map(
      a => a.charAt(0).toUpperCase() + a.substr(1)).join('');
  metadata['get' + name] = metaWithIdGetter('/metadata/h5/metadata/' + i);
});


function metaGetter(path) {
  return function getMetadata(key, callback) {
    if (typeof key === 'function') {
      callback = key;
      key = undefined;
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function');
    }

    key = util.resolveKey(key);

    return util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: path,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      if (err) {
        if (!err.res && err.res.statusCode !== 429)
          return callback(err);
        // Too many requests made, try again later.
        return setTimeout(getMetadata, key.delay(), key, callback);
      }

      validateData(data, callback);
    });
  }
}


function metaWithIdGetter(path) {
  // Usage: getMetadataId(id[, key], callback);
  return function getMetadataId(id, key, callback) {
    if (typeof id !== 'string') {
      throw new TypeError('id must be a string');
    }
    if (typeof key === 'function') {
      callback = key;
      key = undefined;
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function');
    }

    key = util.resolveKey(key);

    return util.httpsGetter({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: path + '/' + id,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (err, data) => {
      if (err) {
        if (!err.res && err.res.statusCode !== 429)
          return callback(err);
        // Too many requests made, try again later.
        return setTimeout(getMetadata, key.delay(), key, callback);
      }

      validateData(data, callback);
    });
  }
}


function validateData(data, callback) {
  let json;
  try {
    json = JSON.parse(data);
  } catch (e) {
    const err = new Error('json failed to parse');
    err.data = data;
    return callback(err);
  }
  callback(null, json);
}
