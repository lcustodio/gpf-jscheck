/**
 * Created by luis on 15-03-29.
 */

'use strict';

module.exports = function (grunt) {

    var jsCheck = require("../gpf-jscheck.js");

    grunt.registerMultiTask('gpfjscheck', 'Check for JavaScript issues.', function () {

        //in order to allow jsCheck to run async.
        var done = this.async();

        var configuration = this.options();
        jsCheck.initConfig(configuration);

        jsCheck.run(function (event){

            if(configuration.verbose) {
                grunt.log.writeln("EVENT TYPE: " + event.type);
            }

            if (event.type === jsCheck.EVENT_DONE) {
                if (event.get("errors").length) {
                    done(false);
                    return(false);
                }
                done(true);
                grunt.log.ok("No validation errors. Code is safe.");
            }
        }, logEventHandling);
    });

    function logEventHandling(event){

        if(event.type === jsCheck.EVENT_LOG_INFO){
            grunt.log.writeln(event.get("message"));
        }
        if(event.type === jsCheck.EVENT_LOG_WARN){
            grunt.log.errorlns(event.get("message"));
        }
        if(event.type === jsCheck.EVENT_LOG_ERROR){
            grunt.warn(event.get("message"));
        }
    }
};