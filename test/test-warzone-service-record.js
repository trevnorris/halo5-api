'use strict';

const api = require('../main');
const assert = require('assert');
const print = process._rawDebug;
let run_counter_error = 0;
let run_counter_ok = 0;


const members =
    [ 'OCD Pirate', 'Xbxmstr07', 'Beelze B00TY', 'Bakemak3r', 'RelyksP',
      'JBDash4', 'Dr Doozies', 'Psycho Punk 01', 'NicochOMG117', 'High x Time',
      'CommanderHawks0', 'dark souls0129', 'StealthSquare46', 'MaxDeadman117',
      'WHYAMIGINGER179', 'AlpineFalcon76', 'idontreallyexist' ];


// First make sure we properly receive errors
api.getWarzoneServiceRecords(members, (err, data) => {
  run_counter_error++;
  assert.ok(err, 'no error was received');
  assert.equal(err.res.statusCode, 400);
  setImmediate(getRecords);
});


function getRecords() {
  members.pop();

  api.getWarzoneServiceRecords(members, (err, data) => {
    if (err) throw err;
    run_counter_ok++;

    if (process.argv[2] === 'print')
      print(data);
    assert.ok(Array.isArray(data), 'data is not an array');
  });
}


process.on('exit', (status) => {
  if (status !== 0) return;
  assert.equal(run_counter_error, 1, 'error callback ran more than once');
  assert.equal(run_counter_ok, 1, 'error callback ran more than once');
});
