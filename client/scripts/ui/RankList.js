'use strict';

var React = require('react');

var RankList = React.createClass({
  render: function() {
    var createItem = function(player, index) {
      return <tr key={player.id}><td className="text-right">{index + 1}</td><td>{player.name}</td><td className="text-right">{player.points}</td></tr>;
    };
    return  <table className="table table-striped table-hover">
              <thead>
                <tr><th className="text-right">No</th><th>Player name</th><th className="text-right">Score</th></tr>
              </thead>
              <tbody>
                {this.props.players.map(createItem)}
              </tbody>
            </table>;
  }
});

module.exports = RankList;
