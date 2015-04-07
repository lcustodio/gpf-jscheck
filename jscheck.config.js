module.exports = function(jsCheck) {
    "use strict";

    jsCheck.initConfig({
        verbose: true,
        files: [
            "/test/scenarios/*.js"
        ],
        rules: [
            "/rules/*.js"
        ]
    });

};
