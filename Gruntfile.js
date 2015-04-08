'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        gpfjscheck: {
            options: {
                verbose: false,
                files: [
                    "test/scenarios/*.js"
                ],
                rules: [
                    "test/rules/*.js"
                ]
            },
            check:{}
        }
    });

    grunt.loadTasks("tasks");

    grunt.registerTask('default', ['gpfjscheck']);

};