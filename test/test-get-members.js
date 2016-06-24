'use strict';

const api = require('../main');
const assert = require('assert');
const print = process._rawDebug;
var run_counter = 0;


api.getMembers('noble reclaimer', (err, members) => {
  if (err) throw err;
  run_counter++;

  if (process.argv[2] === 'print')
    print(members);
  assert.ok(Array.isArray(members), 'members is not an array');
});


process.on('exit', (status) => {
  if (status !== 0) return;
  assert.equal(run_counter, 1, 'callback ran more than once');
});
