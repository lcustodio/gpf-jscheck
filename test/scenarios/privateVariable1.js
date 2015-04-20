'use strict';

function MyClass(){
    this._internal = "pandora";
}

var instanceOfClass = new MyClass();

console.log(instanceOfClass._internal);