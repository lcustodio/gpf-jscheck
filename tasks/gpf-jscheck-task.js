'use strict';

module.exports = function (grunt) {

    var jsCheck = require("../gpf-jscheck.js");

    grunt.registerMultiTask('gpfjscheck', 'Check for JavaScript issues.', function () {

        //in order to allow jsCheck to run async.
        var done = this.async();

        var configuration = this.options();

        var gpfVerbose = (configuration.verbose === undefined) ? false : configuration.verbose;
        var gruntVerbose = (grunt.option('verbose') === undefined) ? false : grunt.option('verbose');

        configuration.verbose = gpfVerbose || gruntVerbose;
        jsCheck.initConfig(configuration);

        jsCheck.run(function (event){

            if(configuration.verbose) {
                grunt.log.writeln(" Event type: " + event.type);
            }
            if(0 === event.type.indexOf("log")){
                logEventHandling(event);
                return;
            }

            if (event.type === jsCheck.EVENT_DONE) {
                if (event.get("errors").length) {
                    done(false);
                    return(false);
                }
                done(true);
                grunt.log.ok("... No critical validation errors.");
            }
        });
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