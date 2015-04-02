"use strict";
/*global rule, match, warning, error, getChildrenOfAST*/

rule("About AJAX calls", function () {

    match(
        /**
         * *[@type='CallExpression'
         *   and callee[@type='MemberExpression'
         *              and object/@name='$'
         *              and property/@name='ajax']]
         */
        function (ast) {
            return ast.type === "CallExpression"
                && ast.callee.type === "MemberExpression"
                && ast.callee.object.name === "$"
                && ast.callee.property.name === "ajax";
        },
        function (ast, ancestors) {
            var
                callbackObj,
                len,
                idx,
                property,
                checked = false;
            callbackObj = (ast.arguments.length > 1) ? ast.arguments[1] : ast.arguments[0];
            if (callbackObj.type === "ObjectExpression") {
                len = callbackObj.properties.length;
                for (idx = 0; idx < len; ++idx) {
                    property = callbackObj.properties[idx];
                    // look for "complete" or "error" callback function
                    if (property.type
                        && (property.key.name === "complete"
                        ||property.key.name === "error")) {
                        checked = true;
                    }
                }

            } else {
                warning("Unable to process type= " + callbackObj.type);
            }
            if (!checked) {
                error("Missing error / complete handler");
            }


            //Check instructions after ajax declaration.
            var parent = ancestors[1], //one level up...
                children = [],
                pos;

            parent.forEach(function(element){
                children.push(getChildrenOfAST(element));
            });

            pos = children.indexOf(ast);
            if (pos < children.length - 1) {
                warning("Instruction found after $.ajax");
            }
        }
    );

});
