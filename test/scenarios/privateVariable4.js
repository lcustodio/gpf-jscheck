'use strict';

function MyClass(){
    this._internal = function(){
        return "pandora";
    };
}

var instanceOfClass = new MyClass();

console.log(instanceOfClass._internal()); //Private variable is a function