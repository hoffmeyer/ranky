# Ranky

Ranky is a quick prototype of a ranking engine created in javascript, nodejs, and express.

If the database is empty, 15 players are created and 100 matches are randomly played

## Changelog
- v0.0.3 Automatic test data generation when database is empty, now handling teams with arbitrary many players
- v0.0.2 Mongodb storage added. All changes are converted to events which are stored. On server startup all the events are loaded from the databse, and state rebuild
- v0.0.1 Simple api implemented, no storage

## Database
The application expects a mongodb running on localhost, and will create a database named ranky with no credentials;

It you want to install mongodb, just run:

`$brew install mongodb`

`$mongod`

And the database should be running.

## Starting the server
After you have checked out the code and installed node and npm. Just run the following commands from the command line:

`$npm install`

`$node app.js`

## API
There are 3 active endpoints, get the current ranking, create a new player, and register a match.

### Get ranking
Post a GET request to /list

### Create new player
Post at POST request to /player containing a JSON body in the following form:

```javascript
{
  "name": "Hans"
}
```

### Register match
Post at POST request to /match containing a JSON body in the following form, players arrays can contain arbitrary many playerids:

```javascript
{
  "team1": {
    "players": [3,5],
    "score": 10
  },
  "team2": {
    "players": [1,5],
    "score": 3 
  }
}
```
