'use strict';

var React = require( 'react');

var TypeaheadSuggestion = React.createClass({
    suggestionClicked: function(){
        this.props.suggestionClicked(this.props.item.name);
    },
    render: function(){
        var classes = 'typeahead_list_item';
        if(this.props.keyboardSelection === this.props.index){
            classes += ' typeahead_list_item-selected';
        }
        return <div key={this.props.item.id} onClick={this.suggestionClicked} className={classes} > {this.props.item.name} </div>;
    }
});

var Typeahead = React.createClass({
    getInitialState: function(){
        return  {    
                    value: '', 
                    matchingPlayers: [],
                    keyboardSelection: -1,
                    showDropdown: false,
                    valid: false
                };
    },
    onChange: function(e){
        this.setState({ value: e.target.value, showDropdown: true });
        this.updateDropdown(e.target.value, true);
        this.validate(e.target.value);
    },
    blur: function(e){
        var self = this;
        setTimeout(function(){
            self.setState({keyboardSelection: -1, showDropdown: false});
            self.updateDropdown(self.state.value, false);
            self.validate();
        }, 10);
    },
    updateDropdown: function(value, showDropdown){
        var self = this;

        if(value && showDropdown){
            this.setState({ matchingPlayers: this.getMatchingPlayers(value)});
        } else {
            this.setState({matchingPlayers: []});
        }
    },
    getMatchingPlayers: function(value){
        if(value){
            return this.props.players.filter(function(element){
                return element.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }).slice(0,5);
        }
        return [];
    },
    validate: function(value){
        var self = this,
            value = value || this.state.value;

        var matchingPlayers = this.props.players.filter(function(element){
            return value.toLowerCase() === element.name.toLowerCase();
        });
        if( matchingPlayers.length === 1 ){
            this.props.onChange(matchingPlayers[0].id);
            this.setState( { value: matchingPlayers[0].name, valid: true });
        } else {
            this.props.onChange(undefined);
            this.setState( {valid: false });
        }
    },
    keyDown: function(e){
        switch (e.key){
            case 'ArrowDown':
                if(this.state.showDropdown) {
                    if(this.state.keyboardSelection < this.state.matchingPlayers.length - 1){
                        this.setState({keyboardSelection: this.state.keyboardSelection + 1});
                    }
                } else {
                    this.setState({showDropdown: true});
                    this.updateDropdown(this.state.value, true);
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if(this.state.keyboardSelection > 0){
                    this.setState({keyboardSelection: this.state.keyboardSelection - 1});
                }
                e.preventDefault();
                break;
            case 'Enter':
                if(this.state.keyboardSelection >= 0 && this.state.keyboardSelection < this.state.matchingPlayers.length){
                    var value = this.state.matchingPlayers[this.state.keyboardSelection].name;
                    this.setState({value: value, showDropdown: false, keyboardSelection: -1});
                    this.updateDropdown(value, false);
                    this.validate(value);
                }
                e.preventDefault();
                break;
            case 'Escape':
                this.setState({keyboardSelection: -1, showDropdown: false});
                this.updateDropdown(this.state.value, false);
                e.preventDefault();
                break;
            default:
        }
    },
    suggestionClicked: function(name){
        this.setState({ value: name});
        this.validate(name);
    },
    render: function() {
        var self = this;
        var createItem = function(item, index){
            return <TypeaheadSuggestion item={item} keyboardSelection={self.state.keyboardSelection} suggestionClicked={self.suggestionClicked} index={index} />;
        };

        return  <div className="typeahead" >
                    <input  className={this.props.className} 
                            type="text" 
                            value={this.state.value} 
                            htmlFor={this.props.htmlFor} 
                            id={this.props.id} 
                            onChange={this.onChange} 
                            onBlur={this.blur}
                            onKeyDown={this.keyDown}
                            autoComplete="off"
                    />
                    <span className="typeahead_validmarker">{this.state.valid ? '✓' : ''}</span>
                    <div className="typeahead_list">
                        {this.state.matchingPlayers.map(createItem)}
                    </div>
                </div>;
    }
});

module.exports = Typeahead;
