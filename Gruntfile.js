'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        gpfjscheck: {
            options: {
                verbose: false,
                files: [
                    "/test/*.js"
                ],
                rules: [
                    "/rules/*.js"
                ]
            },
            check:{}
        }
    });

    grunt.loadTasks("tasks");

    grunt.registerTask('default', ['gpfjscheck']);

};