module.exports = function(jsCheck) {
    "use strict";

    jsCheck.initConfig({
        verbose: false,
        files: [
            "/test/*.js"
        ],
        rules: [
            "/test/rules/*.js"
        ]
    });

};
