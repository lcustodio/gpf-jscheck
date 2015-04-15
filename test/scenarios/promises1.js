"use strict";

var asyncThing1, asyncThing2, asyncThing3, asyncThing4, asyncRecovery1, asyncRecovery2;
asyncThing1 = asyncThing2 = asyncThing3 = asyncThing4 = asyncRecovery1 = asyncRecovery2 = function(id){
    console.log("Function: " + id);
    return new Promise(function(resolve, reject) {
        if(id === "3"){
            reject(id);
        }
        resolve(id);
    });
};

asyncThing1("1").then(function() {
    return asyncThing2("2");
}).then(function() {
    return asyncThing3("3");
}).catch(function(err) {
    return asyncRecovery1("r1");
}).then(function() {
    return asyncThing4("4");
}, function(err) {
    return asyncRecovery2("r2");
}).catch(function(err) {
    console.log("Don't worry about it");
}).then(function() {
    console.log("All done!");
});