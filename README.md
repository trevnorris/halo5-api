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

#### `getArenaServiceRecords(members[, season], callback)`

* `members` {String} or {Array}
* `season` {String}
* `callback` {Function}

Retrieve service record for given spartan or spartans. If `season` is omitted
then default is the current season.

#### `getWarzoneServiceRecords(members, callback)`
#### `getCustomServiceRecords(members, callback)`
#### `getCampaignServiceRecords(members, callback)`

* `members` {String} or {Array}
* `season` {String}
* `callback` {Function}

Retrieve service record for given spartan or spartans.

#### `getArenaPostGame(matchId, callback)`
#### `getWarzonePostGame(matchId, callback)`
#### `getCustomPostGame(matchId, callback)`
#### `getCampaignPostGame(matchId, callback)`

* `matchId` {String}
* `callback` {Function}

Retrieve post game record for given `matchId`.


#### `getEventsForMatch(matchId, callback)`
#### `getEventsForMatchRaw(matchId, callback)`

* `matchId` {String}
* `callback` {Function}

Retrieve match events for given `matchId`. The `Raw` variant returns the
`Buffer` instead of parsing the JSON. Because these are so large and they may
just need to be written directly to disk.


#### `getEmblemImage(spartan[, size], callback)`

* `spartan` {String}
* `size` {Number} Default 256
* `callback` {Function}

Retrieve the url for a Spartan's emblem. While API call may be throttled, the
image URL is hosted on a CDN and is not.


#### `getSpartanImage(spartan[, size[, crop]], callback)`

* `spartan` {String}
* `size` {Number} Default 256
* `crop` {String} Default 'full'
* `callback` {Function}

Retrieve a Spartan's picture. `crop` must be either `full` or `portrait`. While
the API call may be throttled, the image URL returned is hosted on a CDN and
is not.


#### `getPlayerLeaderboard(seasonId, playlistId[, count], callback)`

* `seasonId` {String}
* `playlistId` {String}
* `count` {Numer} Default 200
* `callback` {Function}

Retrieves the player leaderboard. The leaderboard consists of the top players
for a playlist in a season.


#### `metadata.getCampaignMissions(callback)`
#### `metadata.getCommendations(callback)`
#### `metadata.getCsrDesignations(callback)`
#### `metadata.getEnemies(callback)`
#### `metadata.getFlexibleStats(callback)`
#### `metadata.getGameBaseVariants(callback)`
#### `metadata.getImpulses(callback)`
#### `metadata.getMaps(callback)`
#### `metadata.getMedals(callback)`
#### `metadata.getPlaylists(callback)`
#### `metadata.getSeasons(callback)`
#### `metadata.getSkulls(callback)`
#### `metadata.getSpartanRanks(callback)`
#### `metadata.getTeamColors(callback)`
#### `metadata.getVehicles(callback)`
#### `metadata.getWeapons(callback)`
#### `metadata.getGameVariants(id, callback)`
#### `metadata.getMapVariants(id, callback)`
#### `metadata.getRequisitionPacks(id, callback)`
#### `metadata.getRequisitions(id, callback)`

All the calls are pretty much the same, except a few that require an `id`.
