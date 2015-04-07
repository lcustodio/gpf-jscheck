"use strict";
var assert = require("assert");
var jsCheck = require("../gpf-jscheck.js");
var path = require("path");

describe('Array', function(){

    //todo check if it's necessary to unbind jscheck and set again.
    //jscheck.delete

    describe('Ajax calls assertions', function(){

        it('should return 1 error when the call has 1 problem', function(done){

            //var rulePath = path.join(process.cwd(), "../rules/AboutAJAXCalls.js");
            //console.log("rule path: " + rulePath);

            jsCheck.initConfig({
                verbose: true,
                files: [ "scenarios/ajax-scenario1.js" ],
                //rules: [ rulePath ]
                rules: [ ".........//*/**../../../../rules/AboutAJAXCalls.js" ]
            });

            jsCheck.run(function (event){
                if (event.type === jsCheck.EVENT_DONE) {
                    assert.equal(1, event.get('errors').length);
                    done();
                }
            });
        });



        //it.skip('...example', function(){
        //    assert.equal(1, [1,2,3].indexOf(5));
        //    assert.equal(-1, [1,2,3].indexOf(0));
        //});
    })
});