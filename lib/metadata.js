'use strict';

const https = require('https');
const util = require('./util');

const campaign_missions_path = '/metadata/h5/metadata/campaign-missions';
const commendations_path = '/metadata/h5/metadata/commendations';
const csr_designations_path = '/metadata/h5/metadata/csr-designations';
const enemies_path = '/metadata/h5/metadata/enemies';
const medals_path = '/metadata/h5/metadata/medals';
const seasons_path = '/metadata/h5/metadata/seasons';
const vehicles_path = '/metadata/h5/metadata/vehicles';
const weapons_path = '/metadata/h5/metadata/weapons';
const metadata = {};

module.exports.metadata = metadata;

metadata.campaign = metaGetter(campaign_missions_path);
metadata.commendations = metaGetter(commendations_path);
metadata.csr_designations = metaGetter(csr_designations_path);
metadata.enemies = metaGetter(enemies_path);
metadata.medals = metaGetter(medals_path);
metadata.seasons = metaGetter(seasons_path);
metadata.vehicles = metaGetter(vehicles_path)
metadata.weapons = metaGetter(weapons_path)


function metaGetter(path) {
  return function(key, callback) {
    if (typeof key === 'function') {
      callback = key;
      key = undefined;
    }

    key = util.resolveKey(key);

    const req = https.get({
      protocol: 'https:',
      hostname: 'www.haloapi.com',
      path: path,
      headers: {
        Host: 'www.haloapi.com',
        'Ocp-Apim-Subscription-Key': key,
      },
    }, (res) => {
      var data = '';

      if (res.statusCode !== 200) {
        req.abort();
        const err =
            new Error(`request failed ${res.statusCode} ${res.statusMessage}`);
        err.path = path;
        return callback(err);
      }

      // Assuming encoding is utf8.
      res.on('data', (chunk) => data += chunk.toString());
      res.on('error', (er) => callback(er));
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (e) {
          const err = new Error('json failed to parse');
          err.data = data;
          err.url = url;
          return callback(err);
        }

        if (!Array.isArray(json)) {
          const err = new Error('Results was not an Array');
          err.data = json;
          return callback(err);
        }

        callback(null, json);
      });
    });
  }
}
