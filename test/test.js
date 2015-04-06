"use strict";
var assert = require("assert");
var jsCheck = require("../gpf-jscheck.js");
var path = require("path");

describe('Array', function(){

    //todo check if it's necessary to unbind jscheck and set again.
    //jscheck.delete

    describe('Ajax calls assertions', function(){

        it('should return 1 error when the call has 1 problem', function(done){

            console.log("Process CWD: " + process.cwd());
            var rulePath = path.join(process.cwd(), "../rules/About AJAX calls.js");

            jsCheck.initConfig({
                verbose: true,
                files: [ "ajax-scenario1.js" ],
                rules: [ rulePath ]
                //rules: [ "/rules/About AJAX calls.js" ]
            });

            jsCheck.run(function (event){

                console.log("Event: " + JSON.stringify(event));
                console.log("Errors: " + event.get('errors'));

                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(0, event.get('errors').length);
                    done();
                }
            });
        });

        it.skip('...example', function(){
            assert.equal(1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    })
});

/*global process*/
/*
var
    path = require("path"),
    jsCheck = require("./gpf-jscheck.js"),
    configProvider = require(path.join(process.cwd(), "jscheck.config.js"));
configProvider(jsCheck);
jsCheck.run(function (event){

    if(0 === event.type.indexOf("log ")){
        logEventHandling(event);
        //return;
    }
    else if (event.type === jsCheck.EVENT_DONE) {
        if (event.get("errors").length) {
            process.exit(-1);
        }
        process.exit(0);
    }
});

function logEventHandling(event){

    if(event.type === jsCheck.EVENT_LOG_INFO){
        console.log(event.get("message"));
    }
    if(event.type === jsCheck.EVENT_LOG_WARN){
        console.warn(event.get("message"));
    }
    if(event.type === jsCheck.EVENT_LOG_ERROR){
        console.error(event.get("message"));
    }
}

    */