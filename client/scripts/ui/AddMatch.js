'use strict';

var React = require('react'),
    $ = require('jquery'),
    Typeahead = require('./Typeahead');

var AddMatch = React.createClass({
    render: function(){
        return <form className="form-horizontal" >
                <h3>Team1</h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="team1player1">Player 1</label>
                    <div className="col-sm-10">
                        <Typeahead className="form-control" id="team1player1" onChange={this.onTeam1Player1Change} autoFocus="true" players={this.props.players} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="team1player2">Player 2</label>
                    <div className="col-sm-10">
                        <Typeahead className="form-control" id="team1player2" onChange={this.onTeam1Player2Change} players={this.props.players}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="team1score">Score</label>
                    <div className="col-sm-2">
                        <input className="form-control" type="text" id="team1score" onChange={this.onTeam1ScoreChange} />
                    </div>
                </div>

                <h3>Team2</h3>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="team2player1">Player 1</label>
                    <div className="col-sm-10">
                        <Typeahead className="form-control" id="team2player1" onChange={this.onTeam2Player1Change} players={this.props.players}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="team2player2">Player 2</label>
                    <div className="col-sm-10">
                        <Typeahead className="form-control" id="team2player2" onChange={this.onTeam2Player2Change} players={this.props.players}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label" htmlFor="team2score">Score</label>
                    <div className="col-sm-2">
                        <input className="form-control" type="text" id="team2score" onChange={this.onTeam2ScoreChange} />
                    </div>
                </div>
                <div className="form-group">
                    <button disabled={!this.validate()} className="btn btn-primary pull-right" onClick={this.handleClick} >Register</button>
                </div>
            </form>
    },
    validate: function(){
        var isNum = /^[0-9]+$/;
        return  this.state !== null &&
                this.state.team1player1 &&
                this.state.team1score &&
                this.state.team1score.match(isNum) &&
                this.state.team1score &&
                this.state.team2player1 &&
                this.state.team2score &&
                this.state.team2score.match(isNum);
    },
    onTeam1Player1Change: function( value ){
        this.setState({team1player1: value});
    },
    onTeam1Player2Change: function( value ){
        this.setState({team1player2: value});
    },
    onTeam1ScoreChange: function(event){
        this.setState({team1score: event.target.value});
    },
    onTeam2Player1Change: function( value ){
        this.setState({team2player1: value});
    },
    onTeam2Player2Change: function( value ){
        this.setState({team2player2: value});
    },
    onTeam2ScoreChange: function(event){
        this.setState({team2score: event.target.value});
    },
    handleClick: function(e){
        var self = this;
        e.preventDefault();
        var data = {
            team1: {
                score: this.state.team1score,
                players: []
            },
            team2: {
                score: this.state.team2score,
                players: []
            }
        }

        if(this.state.team1player1){
            data.team1.players.push(this.state.team1player1);
        }
        if(this.state.team1player2){
            data.team1.players.push(this.state.team1player2);
        }

        if(this.state.team2player1){
            data.team2.players.push(this.state.team2player1);
        }
        if(this.state.team2player2){
            data.team2.players.push(this.state.team2player2);
        }

        $.ajax({
            type: 'POST',
            url: this.props.source + '/match',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result){
                self.props.onNavigate('list');
            }
        });
    }
});

module.exports = AddMatch;
