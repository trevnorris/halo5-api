'use strict';

const api = require('../main');
const print = process._rawDebug;

const calls = Object.keys(api.metadata);

(function makeMetaCall() {
  if (calls.length === 0) return;

  let fn_name;
  while (calls.length > 0) {
    fn_name = calls.pop();
    if (api.metadata[fn_name].length < 2)
      break;
  }

  api.metadata[fn_name]((err, data) => {
    print(`${fn_name} completed`);
    if (err) {
      print(err.data);
      throw err;
    }
    makeMetaCall();
  });
}());
