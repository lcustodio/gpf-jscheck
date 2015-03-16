"use strict";
/*global process*/
var jsCheck = require("./gpf-jscheck.js");
var configProvider = require("./jscheck.config.js");
configProvider(jsCheck);
jsCheck.run(function (event){
    if (event.type === jsCheck.EVENT_DONE) {
        if (event.get("errors").length) {
            process.exit(-1);
        }
        process.exit(0);
    }
});