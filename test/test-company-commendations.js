'use strict';

const api = require('../main');
const assert = require('assert');
const print = process._rawDebug;
var run_counter = 0;


api.getCompanyCommendations('noble reclaimer', (err, comms) => {
  if (err) throw err;
  run_counter++;

  if (process.argv[2] === 'print')
    print(comms);
  assert.ok(Array.isArray(comms.assist), '"assist" is not an array');
  assert.ok(Array.isArray(comms.kill), '"kill" is not an array');
  assert.ok(Array.isArray(comms.game_mode), '"game_mode" is not an array');
});


process.on('exit', (status) => {
  if (status !== 0) return;
  assert.equal(run_counter, 1, 'callback ran more than once');
});
