"use strict";
/*global process*/
var
    path = require("path"),
    jsCheck = require("./gpf-jscheck.js"),
    configProvider = require(path.join(process.cwd(), "jscheck.config.js")),
    logMapping = {};
// Map log events to console method
logMapping[jsCheck.EVENT_LOG_INFO] = "log";
logMapping[jsCheck.EVENT_LOG_WARN] = "warn";
logMapping[jsCheck.EVENT_LOG_ERROR] = "error";
// Configure jsCheck
configProvider(jsCheck);
// Run
jsCheck.run(function (event){
    if (event.type === jsCheck.EVENT_DONE) {
        if (event.get("errors").length) {
            process.exit(-1);
        }
        process.exit(0);
    }
    var logMethod = logMapping[event.type];
    if (logMethod) {
        console[logMethod](event.get("message"));
    }
});
