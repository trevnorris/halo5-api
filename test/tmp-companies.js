'use strict';
const https =  require('https');
const cheerio = require('cheerio');
const fs = require('fs');
const print = process._rawDebug;

// Adding the export so this file can be used in other files. Will be useful if
// we want to integrate this with other calls (e.g. gathering stats for each
// member of the spartan company).
module.exports.getCompany = getCompany;

const memberUrl = 'https://www.halowaypoint.com/en-us/spartan-companies/';
// Globals are no good. Moving this down to the function call to keep it contains.
//var players = [];


// Here "names" should be an Array. The goal is to retrieve the members of all
// companies passed and return that to the callback.
function getCompany(names, callback) {
  // If "names" is a string then only retrieving a single company.
  if (typeof names === 'string') {
    return getCompanyMembers(names, function(err, data) {
      if (err) return callback(err);
      callback(null, { [names]: data });
    });
  }

  // if we don't have an array then there's nothing to do
  if (!Array.isArray(names))
    throw new TypeError('names should be an array or string');
  // return early if there are no companies to process
  if (names.length === 0)
    return process.nextTick(callback, null, {});

  // Gather all the spartan company member and return them in an object of the
  // following:
  //    {
  //      'company1': [ ...members... ],
  //      'company2': [ ...members... ],
  //      ...
  //    }

  // retObject will conain the company names and members as shown just above.
  const retObj = {};
  // Use reqCntr to keep track of how many requests are in flight at any given
  // time. This way we know when the final request has completed and can call
  // the user's callback.
  var reqCntr = names.length;
  // Using forEach() instead of a for() loop because it hands me "name" instead
  // of needing to assign it as the first loop line of code.
  names.forEach(name => {
    // Make the call to retrieve a single company.
    getCompanyMembers(name, (err, arr) => {
      if (err) return callback(err);
      // Add these results to the object that will be returned to the user.
      retObj[name] = arr;
      // If there are no more requests left then we can call the callback.
      if (--reqCntr <= 0)
        callback(null, retObj);
    });
  });
}


// One usage is to pass a string and resolve that single spartan company
//getCompany('noble reclaimer', (err, names) => print(err ? err : names));

// The other usage is to allow passing an array of spartan companies and
// resolve all the members for all passed companies.
getCompany(['noble reclaimer', 'halowheelmen'],
           (err, names) => print(err ? err : names));


// Since this needs to take more than a single spartan company, we need to make
// more than a single 'https.get()' request. So we're going to wrap the code
// below into a function that can be used elsewhere.
//
// The callback will follow the "errback" pattern where the first argument is
// the error (if ther was one) and after that are the results.
function getCompanyMembers(company, callback) {
  // TODO: Return the request for getCompanyMembers() so that when there are
  // multiple requests, if one fails the remainder can be closed.
  // Also show how this'll work if everything is happy, but will fail if one
  // entry is a bad entry.

  // Now that url() requires an argument, pass in the spartan company that should
  // have been passed in from the command line.
  https.get(url(company), (res) => {
    var data = '';

    // TODO: Add support for 301, check "location" header and try again.

    // Now that we're using the 'errback' pattern we don't want to throw from the
    // call like we were. So instead we send to the callback
    if (res.statusCode !== 200) {
      return callback(new Error('request failed for company ' +
                                company + ' ' +
                                res.statusCode + ' ' +
                                res.statusMessage));
    }

    res.on('data', (chunk) => data += chunk.toString());
    res.on('end', () => {
      const players = [];
      const members = cheerio(data).find('.gamertag.text--medium.case-sensitive');
      for (var i = 0; i < members.length; i++) {
        players.push(members.eq(i).text());
      }

      // If there was no error, it's convention to pass null instead.
      callback(null, players);
    });
    // Remember to handle the errors from both the request and response.
    res.on('error', (e) => callback(e));
  }).on('error', (e) => callback(e));
}


// Convert the spartan company name into the needed url.
function url(company) {
  if (typeof company !== 'string' || company.length === 0)
    throw new TypeError('company should be a string');

  // Now we can normalize the string and return the new url to the user.
  return memberUrl + encodeURI(company.trim().toLowerCase());
}
