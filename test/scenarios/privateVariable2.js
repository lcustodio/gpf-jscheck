'use strict';

function MyClass(){
    this._internal = "pandora";
}

function AnotherClass(myClassDependency){
    this._composition = myClassDependency;
    this._composition._internal = "someone else";

    this.boxDecorator = function(){
        this.c
    }
}

var instanceOfClass = new MyClass();
var anotherClass = new AnotherClass(instanceOfClass);


console.log("Opening the box of " + instanceOfClass._internal);