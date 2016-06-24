'use strict';

const https =  require('https');
const cheerio = require('cheerio');

const memberUrl = 'https://www.halowaypoint.com/en-us/spartan-companies/';


module.exports.getMembers = function getMembers(company, callback) {
  const url = memberUrl + encodeURI(company.trim().toLowerCase());
  company = encodeURI(company.trim().toLowerCase());

  https.get(memberUrl + company, (res) => {
    if (res.statusCode > 200 && res.statusCode < 202) {
      return callback(
          new Error(`request failed ${res.statusCode} ${res.statusMessage}`));
    }

    var data = '';
    res.on('data', (chunk) => data += chunk.toString());
    res.on('end', () => {
      const memberArr = [];
      const members =
          cheerio(data).find('.gamertag.text--medium.case-sensitive');

      if (members.length === 0)
        return callback(new Error('no members found on page'));

      for (var i = 0; i < members.length; i++)
        memberArr.push(members.eq(i).text());

      callback(null, memberArr);
    });
    res.on('error', (e) => callback(e));
  }).on('error', (e) => callback(e));
};
