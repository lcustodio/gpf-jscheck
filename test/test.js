"use strict";
var assert = require("assert");
var jsCheckBase = require("../gpf-jscheck.js");
var extend = require('util')._extend;
//var _ = require('underscore');
var _und = require("underscore");

var jsCheck = _und.clone(jsCheckBase);
var context = {jsCheck: jsCheck};
//var jsCheck1 = _und.clone(jsCheckBase);

describe('Test Suite', function(){

    //todo check if it's necessary to unbind jscheck and set again.
    //jscheck.delete

    describe('Ajax calls assertions', function(){

        beforeEach(function () {
            //jsCheck = _und.clone(jsCheckBase);
            context.jsCheck = _und.clone(jsCheckBase);
        });

        it('should return 2 issues when ajax calls miss complete and has async warning', function(done){

            //var jsCheck = jsCheckBase.clone();
            //var jsCheck = require("../gpf-jscheck.js");
            //this.jsCheck = jsCheckBase;

            //var jsCheck = extend({}, jsCheckBase);
            //var jsCheck = _und.clone(jsCheckBase);
            context.jsCheck.initConfig({
                verbose: true,
                files: [ "scenarios/ajax-scenario1.js" ],
                rules: [ "rules/AboutAJAXCalls.js" ]
            });

            context.jsCheck.run(function (event){
                if (event.type === context.jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('errors').length);
                    assert.equal(1, event.get('warnings').length);
                    done();
                }
            });
        });

        it('should return 1 error when ajax miss complete', function(done){

            //var jsCheck = jsCheckBase.clone();
            //jsCheck.delete();
            //var jsCheck = require("../gpf-jscheck.js");
            //var jsCheck = jsCheckBase;
            //var jsCheck1 = extend({}, jsCheckBase);
            //var jsCheck1 = _und.clone(jsCheckBase);
            context.jsCheck.initConfig({
                verbose: false,
                files: [ "scenarios/ajax-scenario2.js" ],
                rules: [ "rules/AboutAJAXCalls.js" ]
            });

            context.jsCheck.run(function (event){
                if (event.type === context.jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('errors').length, JSON.stringify(event.get('errors')));
                    done();
                }
            });
        });

        afterEach(function(){
            delete context.jsCheck;
        })
    })
});