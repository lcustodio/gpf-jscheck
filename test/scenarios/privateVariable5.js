'use strict';

function MyClass(){
    this._internal = "pandora";
}

var instanceOfClass = new MyClass();

var a = "a";
console.log("Opening the box of " + instanceOfClass._internal + "a"); //private variable inside a binary operation

//todo
//instanceOfClass._internal = "bob"; //forbidden Assignment expression