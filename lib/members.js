'use strict';

const util = require('./util');
const cheerio = require('cheerio');

const member_url = 'https://www.halowaypoint.com/en-us/spartan-companies/';

exports.getMembers = getMembers;


function getMembers(company, callback) {
  if (typeof company !== 'string')
    throw new TypeError('company must be a string');
  if (typeof callback !== 'function')
    throw new TypeError('callback must be a function');

  company = encodeURI(company.trim().toLowerCase());

  util.httpsGetter(member_url + company, (err, data) => {
    if (err) return callback(err);

    const member_arr = [];
    const members =
      cheerio(data).find('.gamertag.text--medium.case-sensitive');

    if (members.length === 0)
      return callback(new Error('no members found on page'));

    for (let i = 0; i < members.length; i++)
      member_arr.push(members.eq(i).text());

    callback(null, member_arr);
  });
};
