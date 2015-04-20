/*global rule, match, info, warning, error, getChildrenOfAST*/

rule('Track use of underscore', function () {
  'use strict';

  match(
    /**
     * *[@type='CallExpression'
     *   and callee[@type='MemberExpression'
     *              and object/@name='_']]
     */
    function (ast) {
      return ast.type === 'CallExpression' &&
        ast.callee.type === 'MemberExpression' &&
        ast.callee.object.name === '_';
    },
    function (ast/*, ancestors*/) {
      info('Use of _.' + ast.callee.property.name);
    }

  );

});
