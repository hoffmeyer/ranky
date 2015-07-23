var should = require('should'),
    ranky = require('../../logic/ranky.js')();

describe('ranky', function(){
    'use strict';
    if('ranky is defined', function() {
        ranky.should.be.ok;
    });
});
