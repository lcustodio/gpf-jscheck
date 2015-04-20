"use strict";
var assert = require("assert"),
    jsCheck,
    verbose = false;

describe('Test Suite', function(){

    beforeEach(function () {
        jsCheck = require("../gpf-jscheck.js");
    });

    describe('Ajax calls assertions', function(){

        it('should return 2 issues when ajax calls miss complete and has async warning', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/ajax1.js" ],
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
                verbose: verbose,
                files: [ "scenarios/ajax2.js" ],
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

    describe('Promises error handling', function(){

        it('should return 1 warning if no catch is defined in a promise', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/promises3.js" ],
                rules: [ "rules/AboutPromises.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('warnings').length);
                    done();
                }
            });
        });

        it('should return 1 warning if there is one .then after a .catch', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/promises2.js" ],
                rules: [ "rules/AboutPromises.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('warnings').length);
                    done();
                }
            });
        });

        it('should return no error is the promise is properly defined', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/promises4.js" ],
                rules: [ "rules/AboutPromises.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(0, event.get('warnings').length);
                    assert.equal(0, event.get('errors').length);
                    done();
                }
            });
        });

        it('should return 1 warning even if using the conceptually correct ".then(undefined, function(){})"', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/promises4.js" ],
                rules: [ "rules/AboutPromises.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(0, event.get('warnings').length);
                    assert.equal(0, event.get('errors').length);
                    done();
                }
            });
        });
    });

    describe('Private Variables improper usage', function(){

        it('should return 1 info when a private variable (string) is used in a global function', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/privateVariable1.js" ],
                rules: [ "rules/InappropriatePrivateVariableAccess.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('infos').length);
                    done();
                }
            });
        });

        it('should return 1 info when a private variable (function) is used in a global function', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/privateVariable4.js" ],
                rules: [ "rules/InappropriatePrivateVariableAccess.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('infos').length);
                    done();
                }
            });
        });

        it('should return no info when a private variable is used into the class function (this.x)', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/privateVariable3.js" ],
                rules: [ "rules/InappropriatePrivateVariableAccess.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(0, event.get('infos').length);
                    assert.equal(0, event.get('warnings').length);
                    assert.equal(0, event.get('errors').length);
                    done();
                }
            });
        });

        it('should return 1 info when a private variable (string) is used as a complex operation', function(done){

            jsCheck.initConfig({
                verbose: verbose,
                files: [ "scenarios/privateVariable5.js" ],
                rules: [ "rules/InappropriatePrivateVariableAccess.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('infos').length);
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