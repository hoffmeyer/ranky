# Ranky

Ranky is a quick prototype of a ranking engine created in javascript, nodejs, and express.

Currently there is no persitent storage, however, the application creates dummy players on startup, and plays a 1000 random matches.

## Starting the server
After you have checked out the code and installed node and npm. Just run the following commands from the command line:

npm install
node app.js

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
Post at POST request to /match containing a JSON body in the following form:

```javascript
{
  "player1": 1,
  "score1": 10,
  "player2": 4,
  "score2": 5
}
```
