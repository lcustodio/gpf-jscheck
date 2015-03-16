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
                callbackObj = ast.arguments[1],
                len,
                idx,
                property,
                checked = false;
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
            var parent = ancestors[0],
                children,
                pos;
            if (parent.type === "ExpressionStatement") {
                parent = ancestors[1];
            }
            children = getChildrenOfAST(parent);
            pos = children.indexOf(ast);
            if (pos < children.length - 1) {
                warning("Instruction found after $.ajax");
            }
        }
    );

});
