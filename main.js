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

// Retrieve Matches for given Spartan.
Object.assign(module.exports, require('./lib/player-matches'));

// Retrieve post game carnage information.
Object.assign(module.exports, require('./lib/postgame'));

// Retrieve Events for Match.
Object.assign(module.exports, require('./lib/match-events'));

// Expose simple utilities to make life easier. Doing it this way to prevent
// users from being able to override the same methods used internally.
Object.assign((module.exports.util = {}), require('./lib/util'));
