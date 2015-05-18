'use strict';

var React = require('react'),
    NavigationItem = require('./NavigationItem');

var Navigation = React.createClass({
    handleClick: function(pageName){
        this.props.onNavigate(pageName);
    },
    render: function(){
        var items = [];

        for( var key in this.props.pages ){
            items.push(<NavigationItem key={key} name={this.props.pages[key]} destination={key} currentPage={this.props.currentPage} onNavigate={this.props.onNavigate} />);
        };

        return (
            <ul className="nav nav-tabs nav-justified">
                {items}
            </ul>
        );
    }
});

module.exports = Navigation;
