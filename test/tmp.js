'use strict';

const getMembers = require('./lib/members').getMembers;
const getWarzoneRecord =
    require('./lib/warzone-service-record').getWarzoneRecord;
const print = process._rawDebug;


(function process() {
  const records =
      JSON.parse(require('fs').readFileSync('/tmp/spartan-records.json'));

  const WHEELMAN = 125834251;
  const HEADSHOT = 3261908037;
  const wheelmans = [];
  var cntr = 0;
  for (var i = 0; i < records.length; i++) {
    const medals = records[i].Result.WarzoneStat.MedalAwards;
    for (var j = 0; j < medals.length; j++) {
      if (medals[j].MedalId === WHEELMAN) {
        wheelmans.push([records[i].Id, medals[j].Count, records[i].Result.WarzoneStat.TotalGamesCompleted]);
        break;
      }
    }
  }

  var sum = 0;
  wheelmans.sort((a, b) => b[1] - a[1]);
  for (var i = 0; i < wheelmans.length; i++) {
    if (i < 15)
      sum += wheelmans[i][1];
    let space = 25 - wheelmans[i][0].length - wheelmans[i][1].toString().length - (i + 1).toString().length;
    if (space <= 0) space = 1;
    print(`${i+1}: ` + wheelmans[i][0] + ' '.repeat(space) + wheelmans[i][1].toString() + '   ' + (wheelmans[i][1] / wheelmans[i][2]).toFixed(2));
  }
  print('sum:', sum);
}());
/* */


/*
getMembers('noble reclaimer', (err, data) => {
  if (err) throw err;
  getWarzoneRecord(data, memberWarzoneRecords);
});
/* */


function memberWarzoneRecords(err, records) {
  if (err) throw err;
  print(`retrieved ${records.length} records`);
  const json = JSON.stringify(records, null, '  ');
  require('fs').writeFileSync('/tmp/spartan-records.json', json);
  print(`wrote ${Buffer.byteLength(json)} to disk`);
}