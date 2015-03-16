"use strict";
/*global process*/
var
    path = require("path"),
    jsCheck = require("./gpf-jscheck.js"),
    configProvider = require(path.join(process.cwd(), "jscheck.config.js"));
configProvider(jsCheck);
jsCheck.run(function (event){
    if (event.type === jsCheck.EVENT_DONE) {
        if (event.get("errors").length) {
            process.exit(-1);
        }
        process.exit(0);
    }
});