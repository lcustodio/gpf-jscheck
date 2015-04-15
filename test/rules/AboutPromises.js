"use strict";
/*global match, warning, error*/

rule("About Promises", function () {

    match(
        /*
         "type": "CallExpression",
         "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
                "type": "Identifier",
                "name": "foo"
            },
            "property": {
                "type": "Identifier",
                "name": "then"
            }
         },
        */
        function (ast) {
            return ast.type === "CallExpression"
                && ast.callee.type === "MemberExpression"
                && ast.callee.property.name === "then";
        },
        function (ast, ancestors) {

            var parent = ancestors[0],
                propertiesLength,
                i, //index
                property,
                problem = false;

            //warning... this may change as esprima still considers promise as a property.
            if (parent.type === "MemberExpression" && parent.property) {
                propertiesLength = parent.property.length;

                for (i = 0; i < propertiesLength; ++i) {
                    property = parent.properties[i];
                    // look for "catch"
                    if (property.type && property.name === "catch") {
                        problem = true;
                    }
                }
            }
            else { //no property (.catch) defined.
                problem = true;
            }

            if(problem){
                warning("The promise is not handling errors");
            }
        }
    );
});