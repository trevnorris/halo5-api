'use strict';

const api = require('../main');
const print = process._rawDebug;

const req = api.metadata.vehicles((err, data) => {
  if (err) throw err;
  if (process.argv[2] === 'print') print(data);
});
