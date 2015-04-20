'use strict';

function MyClass(){
    this._internal = "pandora";

    this.print = function(){
        console.log(this._internal);
    }
}

var instanceOfClass = new MyClass();

instanceOfClass.print();