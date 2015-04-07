module.exports = function(jsCheck) {
    "use strict";

    jsCheck.initConfig({
        verbose: false,
        files: [
            "/test/scenarios/*.js"
        ],
        rules: [
            "test/rules/*.js"
        ]
    });

};
