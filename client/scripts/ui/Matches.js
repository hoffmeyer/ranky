'use strict';

var React = require('react'),
    $ = require('jquery');

var Match = React.createClass({
    render: function(){
        var playersToString = function(players){
            var string = '';
            players.forEach(function(elem){
                string = string + elem.id + ': ' + elem.points + ' ';
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
        return {
            matches: []
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
        var rows = [];
        this.state.matches.forEach(function(match, index){
            rows.push(<tr><td><Match match={match} index={index} /></td></tr>);
        });
        return  <table className="table table-striped table-hover">
                    <tbody>
                        {rows}
                    </tbody>
                </table>;
    }
});

module.exports = Matches;
