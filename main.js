'use strict';


// Retrieve all commendations for a Spartan Company.
Object.assign(module.exports, require('./lib/commendations'));

// Retrieve list of members in a Spartan Company.
Object.assign(module.exports, require('./lib/members'));

// Retrieve metadata.
Object.assign(module.exports, require('./lib/metadata'));

// Retrieve Arena Service Record for a list of Spartans.
Object.assign(module.exports, require('./lib/arena-service-record'));

// Retrieve Warzone Service Record for a list of Spartans.
Object.assign(module.exports, require('./lib/warzone-service-record'));
