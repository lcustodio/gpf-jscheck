/*global rule, match, info, warning, error, getChildrenOfAST*/

rule('InappropriatePrivateVariableAccess', function () {
//    'use strict';
    match(
        function (ast) {

            return ast.type === 'ExpressionStatement';// &&
                //ast.expression.type === 'AssignmentExpression' &&
                //ast.expression.type === 'CallExpression'; //&&

                    //(ast.expression.left.property.name.indexOf("_") === 0 ||
                    //ast.expression.right.property.name.indexOf("_") === 0 ||
                    //ast.expression["arguments"].value.right.property.name.indexOf("_") === 0);
        },
        function (ast, ancestors) {

            var problem;
            //case 1
            /*
            "type": "ExpressionStatement",
                "expression": {
                "type": "CallExpression",
                    **
                },
                "arguments": [
                    {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "instanceOfClass"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "_internal"
                        }
                    }
                ]
            }*/
            if( ast.expression.type === 'CallExpression' &&
                ast.expression["arguments"]
            ){
                ast.expression["arguments"].forEach(function(currentValue){

                    if(currentValue.property &&
                        currentValue.property.name.indexOf("_") === 0 &&
                        currentValue.object.type !== 'ThisExpression') {

                        //info('InappropriatePrivateVariableAccess.');
                        problem = true;
                    }

                    else if(currentValue.callee &&
                        currentValue.callee.property.name.indexOf("_") === 0 &&
                        currentValue.callee.object.type !== 'ThisExpression') {

                        //info('InappropriatePrivateVariableAccess.');
                        problem = true;

                    }

                    else if(currentValue.type === "BinaryExpression"){
                        problem = isThereAPrivateVariableUsage(currentValue);
                    }

                });
            }

            //if( ast.expression.type === 'AssignmentExpression' &&
            //        (
            //            (ast.expression.left.type === 'MemberExpression' &&
            //             ast.expression.left.property.name.indexOf("_") === 0) ||
            //            (ast.expression.right.type === 'MemberExpression' &&
            //             ast.expression.right.property.name.indexOf("_") === 0 )
            //        ) &&
            //    ast.expression.left.object &&
            //    ast.expression.left.object.type !== 'ThisExpression'
            //){
            //    //console.log(ast.expression);
            //    warn('InappropriatePrivateVariableAccess.');
            //}

            if(problem){
                info('InappropriatePrivateVariableAccess.');
            }
        }
    );

    function isThereAPrivateVariableUsage(ast){
        if(ast.left &&
            ast.left.type === "BinaryExpression"){

            return isThereAPrivateVariableUsage(ast.left);
        }
        if( (ast.left.property &&
            propertyHasInvalidUsageOfPrivateVariable(ast.left.property, ast.left))  ||
            (ast.right.property &&
            propertyHasInvalidUsageOfPrivateVariable(ast.right.property, ast.right))
        ){
            return true;
        }
    }

    function propertyHasInvalidUsageOfPrivateVariable(property, object){
        if(property.name.indexOf("_") === 0 &&
            object.type !== 'ThisExpression'){

            return true;

        }
    }
});