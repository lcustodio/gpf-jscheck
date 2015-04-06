module.exports = function(jsCheck) {
    "use strict";

    jsCheck.initConfig({
        verbose: true,
        files: [
            "/test/*.js"
        ],
        rules: [
            "/rules/*.js"
        ]
    });

};
