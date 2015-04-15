'use strict';

function okToGreet(name){
    return name.indexOf("Robin") === 0;
}

function asyncGreet(name) {

    return new Promise(function(resolve, reject) {

        setTimeout(function() {
            var x = name.foo; // foo is undefined, which will led to an exception on the promise.
            if (okToGreet(name)) {
                resolve(x);
            } else {
                reject(
                    function(){
                        return 'Greeting ' + name + ' is not allowed.'
                    }
                );
            }
        }, 100);

    });
}

var promise = asyncGreet('Robin Hood');
promise.then(function(greeting) {
    console.log('Success: ' + greeting()); // 'greeting()' is undefined!!
}, function(reason) {
    console.log('Failed: ' + reason());
}).then(undefined, function(err){
    console.log("Handling error: " + err);
});

