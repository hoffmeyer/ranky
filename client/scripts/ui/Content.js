'use strict';

var React = require('react'),
    RankList = require('./RankList'),
    AddMatch = require('./AddMatch'),
    Matches = require('./Matches'),
    AddPlayer = require('./AddPlayer');

var Content = React.createClass({
    getContent: function() {
        if(this.props.show === 'addScore'){
            return <AddMatch 
                        onNavigate={this.props.onNavigate} 
                        players={this.props.players} 
                        source={this.props.source}
                    />;
        } else if(this.props.show === 'addPlayer'){
            return <AddPlayer 
                        onNavigate={this.props.onNavigate} 
                        players={this.props.players} 
                        source={this.props.source}
                    />;
        } else if(this.props.show === 'matches'){
            return <Matches players={this.props.players} />;
        }
        return <RankList players={this.props.players} />
    },
    render: function(){
        return this.getContent();
    }
});

module.exports = Content;
