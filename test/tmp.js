'use strict';

const fs = require('fs');
const api = require('../main');
const print = process._rawDebug;


var t = Date.now();
api.getMembers('noble reclaimer', (err, data) => {
  if (err) throw err;
  print('getMembers complete:', data.length);
  api.getWarzoneServiceRecords(data, (err, data) => {
    if (err) throw err;
    print('getWarzoneServiceRecords complete');
    fs.writeFileSync(__dirname + '/files/noble_reclaimer_warzone_service_records.json',
                     JSON.stringify(data));
    print('file written to disk');
    t = Date.now() - t;
    print('Took', (t / 1e3).toFixed(1),'sec');
  });
});


//api.getCompanyCommendations('noble reclaimer', (err, data) => {
  //if (err) throw err;

  //console.log(data);
//});


/*
api.getEmblemImage('sudsed', (err, url) => {
  print('emblem', url);
});

api.getSpartanImage('sudsed', (err, url) => {
  print('spartan', url);
});
*/

/*
var d = Date.now();
api.getMembers('noble reclaimer', (err, members) => {
  if (err) throw err;
  api.getWarzoneServiceRecords(members, (err, records) => {
    if (err) throw err;
    d = Date.now() - d;
    print(Buffer(JSON.stringify(records)).length);
    print(d);
  });
});
*/


//api.getCustomServiceRecords('sudsed', (err, data) => {
  //if (err) throw err;
  //console.log(data);
//});



/*
api.getSpartanMatches('sudsed', 'warzone', 2, 5, (err, sdata) => {
  if (err) throw err;
  api.getSpartanMatches('PainedZeddicus', 'warzone', 0, 5, (err, pdata) => {
    if (err) throw err;
    processData(sdata.Results, pdata.Results);
  });
});


function processData(suds, zedd) {
  for (var i = 0; i < suds.length; i++) {
    console.log(suds[i].Id.MatchId === zedd[i].Id.MatchId, suds[i].Id.MatchId);
  }
  //for (let i of suds)
    //console.log('suds:', i.Id.MatchId);
  //for (let i of zedd)
    //console.log('zedd:', i.Id.MatchId);
}
*/


/*
api.getArenaServiceRecords(['sudsed', 'PainedZeddicus'], (err, data) => {
  if (err) throw err;
  console.log(data);
});
*/

/*
api.getSpartanMatches('sudsed', 'warzone,arena', (err, data) => {
  if (err) throw err;

  console.log(data.Results);
});
*/


/*
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


getMembers('noble reclaimer', (err, data) => {
  if (err) throw err;
  getWarzoneRecord(data, memberWarzoneRecords);
});


function memberWarzoneRecords(err, records) {
  if (err) throw err;
  print(`retrieved ${records.length} records`);
  const json = JSON.stringify(records, null, '  ');
  require('fs').writeFileSync('/tmp/spartan-records.json', json);
  print(`wrote ${Buffer.byteLength(json)} to disk`);
}
*/
