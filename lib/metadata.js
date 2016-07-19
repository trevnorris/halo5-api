'use strict';

const util = require('./util');
const metadata = {};

module.exports = metadata;


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
  const name =
    i.split('-').map(a => a.charAt(0).toUpperCase() + a.substr(1)).join('');
  metadata['get' + name] = metaGetter('/metadata/h5/metadata/' + i);
});


// This is the metadata that requires an id.
[
  'game-variants',
  'map-variants',
  'requisition-packs',
  'requisitions',
].forEach((i) => {
  const name =
    i.split('-').map(a => a.charAt(0).toUpperCase() + a.substr(1)).join('');
  metadata['get' + name] = metaWithIdGetter('/metadata/h5/metadata/' + i);
});


function metaGetter(api_path) {
  return function getMetadata(callback) {
    if (typeof callback !== 'function')
      throw new Error('callback must be a function');

    const key = util.resolveKey();

    util.generalizedStatGetter(key, api_path, callback);
  }
}


function metaWithIdGetter(path) {
  // Usage: getMetadataId(id, callback);
  return function getMetadataId(id, callback) {
    if (typeof id !== 'string')
      throw new TypeError('id must be a string');
    if (typeof callback !== 'function')
      throw new Error('callback must be a function');

    const key = util.resolveKey();
    const api_path = `${path}/${id}`;

    util.generalizedStatGetter(key, api_path, callback);
  }
}
