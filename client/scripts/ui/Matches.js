'use strict';

var React = require('react'),
    $ = require('jquery');

var Match = React.createClass({
    render: function(){
        var self = this;
        var playersToString = function(players){
            var string = '';
            players.forEach(function(elem){
                string = string + self.props.playersToString[elem.id] + ': ' + elem.points + ' ';
            });
            return string;
        };

        return  <div>
                    <p>Team1: {this.props.match.team1.score} </p>
                    <p>{playersToString(this.props.match.team1.players)}</p>
                    <p>Team2: {this.props.match.team2.score} </p>
                    <p>{playersToString(this.props.match.team2.players)}</p>
                </div>;
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
            rows.push(<tr key={index}><td><Match match={match} index={index} playersToString={self.state.playerIdToName} /></td></tr>);
        });
        return  <table className="table table-striped table-hover">
                    <tbody>
                        {rows}
                    </tbody>
                </table>;
    }
});

module.exports = Matches;
