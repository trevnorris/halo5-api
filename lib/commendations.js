'use strict';

const util = require('./util');
const cheerio = require('cheerio');

module.exports.getCompanyCommendations = getCompanyCommendations;

const base_url = 'https://www.halowaypoint.com/en-us/games/halo-5-guardians/' +
                 'xbox-one/commendations/spartan-companies/';


function getCompanyCommendations(company, callback) {
  company = encodeURI(company.trim().toLowerCase());

  // urls -> { assist: <href>, kill: <href>, game_mode: <href> }
  getUrls(company, (err, urls) => {
    if (err)
      return callback(err);
    getComms(urls, (err, comms) => callback(err, comms));
  });
}


function getUrls(company, callback) {
  util.httpsGetter(base_url + company, (err, data) => {
    if (err) return callback(err);

    const obj = {};
    const $ = cheerio.load(data);
    const links = $('nav.nav-links.nav-links--l2 a');
    for (var i = 0; i < links.length; i++) {
      const type = links.eq(i).text().trim().toLowerCase().replace(' ', '_');
      // Filter out possible nav links that aren't needed.
      if (/^(assist|kill|game_mode)$/.test(type))
        obj[type] = links.eq(i).attr('href');
    }
    if (!obj.assist || !obj.kill || !obj.game_mode)
      return callback(new Error('not all links were found'), obj);
    callback(null, obj);
  });
}


function getComms(urls, callback) {
  const results = {};
  const keys = Object.keys(urls);
  var calls = keys.length;
  for (let i = 0; i < keys.length; i++) {
    util.httpsGetter(urls[keys[i]], (err, data) => {
      results[keys[i]] = scrapeData(data);
      if (--calls <= 0)
        callback(null, results);
    });
  }
}


function scrapeData(data) {
  const entries = [];
  const $ = cheerio.load(data);
  const comm = $('.commendation');
  comm.each(function(i, e) {
    // Add new entry.
    const c = {
      name: $(e).find('.text--large').text(),
      percent: $(e).find('.numeric--small').eq(0).text(),
      level: $(e).find('.text--smallest').eq(0).text().split(' ')[1],
      desc: $(e).find('.description').first().text(),
    };
    entries.push(c);
  });
  return entries;
}
