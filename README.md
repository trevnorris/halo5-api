## Halo 5 Stats API

Environment Variables:

* `HALO5_DEV_KEY`: The 32 character Halo 5 developer key to perform queries.
* `HALO5_QUERY_DELAY`: Number of milliseconds to wait between queries. Default
  is 1200ms.

### API:

#### `getCompanyCommendations(company, callback)`

* `company` {String}
* `callback` {Function}

Retrieve all commendations for given `company`.

#### `getMembers(company, callback)`

* `company` {String}
* `callback` {Function}

Retrieve all members for given `company`.

#### `getArenaRecords(members[, season[, key]], callback)`

* `members` {String} or {Array}
* `season` {String}
* `key` {String}
* `callback` {Function}

Retrieve service record for given spartan or spartans. If `season` is omitted
then default is the current season.

#### `getWarzoneRecords(members[, season[, key]], callback)`

* `members` {String} or {Array}
* `season` {String}
* `key` {String}
* `callback` {Function}

Retrieve service record for given spartan or spartans. If `season` is omitted
then default is the current season.

#### `getArenaPostGame(matchId[, key], callback)`

* `matchId` {String}
* `key` {String}
* `callback` {Function}

Retrieve post game service record for given `matchId`.

#### `getWarzonePostGame(matchId[, key], callback)`

* `matchId` {String}
* `key` {String}
* `callback` {Function}

Retrieve post game service record for given `matchId`.

#### `metadata.campaign()`
#### `metadata.commendations()`
#### `metadata.csr_designations()`
#### `metadata.enemies()`
#### `metadata.medals()`
#### `metadata.seasons()`
#### `metadata.vehicles()`
#### `metadata.weapons()`

Retrieve metadata.
