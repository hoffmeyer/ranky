'use strict';

var React = require('react'),
    RankList = require('./RankList'),
    AddMatch = require('./AddMatch'),
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
        }
        return <RankList players={this.props.players} />
    },
    render: function(){
        return this.getContent();
    }
});

module.exports = Content;
