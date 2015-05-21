'use strict';

var React = require('react');

var Match = React.createClass({
    render: function(){
        var self = this;
        var playersToString = function(players){
            return players.map(function(elem){
                return self.props.playersToString[elem.id];
            }).join( ' & ');
        };
        var options = {
            year: "2-digit", month: "numeric",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };

        return  <tr>
                    <td>
                        {new Date(this.props.match.time).toLocaleDateString("da-DK", options)}
                    </td>
                    <td className="text-center">
                        {playersToString(this.props.match.team1.players)}<br/><b>vs</b><br/>{playersToString(this.props.match.team2.players)}
                    </td>
                    <td className="text-center">
                        {this.props.match.team1.score + ' - ' + this.props.match.team2.score}
                    </td>
                    <td className="text-right">
                        {Math.round(Math.abs(this.props.match.team1.players[0].points) * 10) / 10}
                    </td>
                </tr>;
    }
});

var Matches = React.createClass({
    getInitialState: function(){
        var playerIdToName = {};
        this.props.players.forEach(function(player){
            playerIdToName[player.id] = player.name;
        });

        return {
            matches: [],
            playerIdToName: playerIdToName,
        };
    },
    componentDidMount: function(){
        var req = new XMLHttpRequest();
        req.onreadystatechange=function() {
            if (req.readyState==4 && req.status==200) {
                if(this.isMounted()){
                    this.setState({
                        matches: JSON.parse(req.responseText)
                    });
                }
            }
        }.bind(this);
        req.open('GET', '/match', true );
        req.send();
    },
    render: function(){
        var self = this;
        var rows = [];
        this.state.matches.forEach(function(match, index){
            rows.push(<Match key={index} match={match} index={index} playersToString={self.state.playerIdToName} />);
        });
        return  <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th className="text-center">Players</th>
                            <th className="text-center">Match score</th>
                            <th className="text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>;
    }
});

module.exports = Matches;
