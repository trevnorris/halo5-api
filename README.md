## Halo 5 Stats API

**Developer Key:**

An included empty file `developer_key` is where you can store the development
key so as to not require always having it passed in as an environment variable.
To make sure your key does not accidentally get committed, please do the
following to prevent git from tracking any changes:
```
$ git update-index --assume-unchanged developer_key
```

The development key can also be passed in via an environment variable
(defined below). Multiple keys can also be passed, comma separated. So if
several people are working on the same project, but not all using their keys
at the same time those keys can be leveraged by the group.


**Environment Variables:**

The environment variable is set for every API request, so a key can be added
at runtime by adding it to `process.env`.

* `HALO5_DEV_KEY`: The 32 character Halo 5 developer key to perform queries.
* `HALO5_QUERY_DELAY`: Number of milliseconds to wait between queries. Default
  is 1200ms.
* `HALO5_429_RETRIES`: When an HTTP status code of `429` is found the API will
  automatically retry after a short delay. The default number of retries is 3
  before the callback is called with the error. This value can be overridden
  using this environment variable.

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
