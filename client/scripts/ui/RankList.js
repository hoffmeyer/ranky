'use strict';

var React = require('react');

var RankList = React.createClass({
  render: function() {
    var createItem = function(player, index) {
      var winLoseStatusClass = "notPlayed";
      if(player.currentWinsInRow !== 0 ){
          winLoseStatusClass = "won" + player.currentWinsInRow;
      } else if (player.currentLossesInRow !== 0 ) {
          winLoseStatusClass = "lost" + player.currentLossesInRow;
      }
      return <tr key={player.id} className={winLoseStatusClass}>
                <td className="text-right">{index + 1}</td>
                <td>{player.name}</td><td className="text-right">{player.points}</td>
              </tr>;
    };
    return  <table className="rankTable table ">
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
