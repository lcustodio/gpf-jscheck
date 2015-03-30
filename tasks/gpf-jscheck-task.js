/**
 * Created by luis on 15-03-29.
 */

'use strict';

module.exports = function (grunt) {

    var jsCheck = require("../gpf-jscheck.js");

    grunt.registerMultiTask('gpfjscheck', 'Check for JavaScript issues.', function () {

        //in order to allow jsCheck to run async.
        var done = this.async();

        jsCheck.initConfig(this.options());

        jsCheck.run(function (event){
            if (event.type === jsCheck.EVENT_DONE) {
                if (event.get("errors").length) {
                    done(false);
                    return(false);
                    //grunt.fail.fatal(err);
                }
                done(true);
                grunt.log.ok("No validation errors. Code is safe.");
            }
        });
    });
};