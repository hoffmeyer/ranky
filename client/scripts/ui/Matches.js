'use strict';

var React = require('react'),
    $ = require('jquery');

var Match = React.createClass({
    render: function(){
        var self = this;
        var playersToString = function(players){
            return players.map(function(elem){
                return self.props.playersToString[elem.id];
            }).join( ' & ');
        };
        var options = {
            year: "2-digit", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };

        return  <tr>
                    <td>
                        {new Date(this.props.match.time).toLocaleDateString("da-DK", options)}
                    </td>
                    <td>
                        {playersToString(this.props.match.team1.players)} <b>vs</b> {playersToString(this.props.match.team2.players)}
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
        $.get('/match', function(result){
            if(this.isMounted()){
                this.setState({
                    matches: result
                });
            }
        }.bind(this));
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
                            <th>Players</th>
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
