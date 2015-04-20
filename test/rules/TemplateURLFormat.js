/*global rule, match, info, warning, error, getChildrenOfAST*/

rule('Check the templateURL format', function () {
  'use strict';

  match(
    /**
     * *[@type='Property' and key[@name='templateUrl']]
     */
    function (ast) {
      return ast.type === 'Property' &&
        ast.key &&
        ast.key.name === 'templateUrl';
    },
    function (ast/*, ancestors*/) {
      if (ast.value.value.charAt(0) === '/') {
        error('templateUrl must not start with /');
      }
    }

  );

});
