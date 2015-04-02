"use strict";
/*global process*/
var
    path = require("path"),
    jsCheck = require("./gpf-jscheck.js"),
    configProvider = require(path.join(process.cwd(), "jscheck.config.js"));
configProvider(jsCheck);
jsCheck.run(function (event){

    if(0 === event.type.indexOf("log ")){
        logEventHandling(event);
        //return;
    }
    else if (event.type === jsCheck.EVENT_DONE) {
        if (event.get("errors").length) {
            process.exit(-1);
        }
        process.exit(0);
    }
});

function logEventHandling(event){

    if(event.type === jsCheck.EVENT_LOG_INFO){
        console.log(event.get("message"));
    }
    if(event.type === jsCheck.EVENT_LOG_WARN){
        console.warn(event.get("message"));
    }
    if(event.type === jsCheck.EVENT_LOG_ERROR){
        console.error(event.get("message"));
    }
}