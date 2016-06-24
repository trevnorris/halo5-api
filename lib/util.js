'use strict';

const fs = require('fs');

module.exports.printf = printf;

// Right now simply print to stdout synchronously w/o automatic formatting.
// Currently a small number of formatting options are available:
//    %d - Print argument as a double
//    %.<n>d - Print double with <n> decimal digits
//    %i - Print argument as an int32
//    %u - Print argument as an uint32
//    %h - Print argument as an uint32 in base 16
//    %s - Print argument as a string
//    %% - Print %
function printf(str) {
  var retstr = '';
  var idx = 1;
  str.split(/(%[^%]*[diuhs%])/).forEach(item => {
    if (item.charAt(0) !== '%')
      retstr += item;
    else if (item === '%%')
      retstr += '%';
    else
      retstr += convertArg(item, arguments[idx++]);
  });
  fs.writeSync(1, retstr);
}


function convertArg(mod, val) {
  var arr;

  switch (mod) {
    case '%i':
      return val >> 0;
    case '%u':
      return val >>> 0;
    case '%h':
      return (val >>> 0).toString(16);
    case '%d':
      return +val;
    case '%s':
      return '' + val;
    case '%%':
      return '%';

    default:
      if (arr = mod.match(/^%\.([0-9]+)d$/)) {
        return (+val).toFixed(arr[1]);
      }
  };

  throw new Error(`unexpected arguments: ${mod}  ${val}`);
}
