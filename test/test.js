"use strict";
var assert = require("assert");
var jsCheck;

describe('Test Suite', function(){

    beforeEach(function () {
        jsCheck = require("../gpf-jscheck.js");
    });

    describe('Ajax calls assertions', function(){

        it('should return 2 issues when ajax calls miss complete and has async warning', function(done){

            jsCheck.initConfig({
                verbose: true,
                files: [ "scenarios/ajax-scenario1.js" ],
                rules: [ "rules/AboutAJAXCalls.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('errors').length);
                    assert.equal(1, event.get('warnings').length);
                    done();
                }
            });
        });

        it('should return 1 error when ajax miss complete', function(done){

            jsCheck.initConfig({
                verbose: false,
                files: [ "scenarios/ajax-scenario2.js" ],
                rules: [ "rules/AboutAJAXCalls.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    var errors = event.get('errors');
                    assert.equal(1, errors.length, JSON.stringify(errors));
                    done();
                }
            });
        });
    });

    afterEach(function(){
        var module = require.resolve("../gpf-jscheck.js");
        delete require.cache[module];
    })
});