/*jshint node: true*/
/*global module*/
(function (exports) {
    "use strict";

    var
        _fs = require("fs"),
        _path = require("path"),
        _esprima = require("esprima"),
        _config,
        _eventsHandler;

    //region Helpers that will move in GPF library

    /**
     * Simulate gpf.events.fireEvent behavior
     *
     * @param {String} event event name
     * @param {Object} [params={}] params parameter of the event (when type is a
     * string)
     * @param {gpf.events.Handler} eventsHandler
     */
    function _gpfEventsFire(event, params, eventsHandler) {
        eventsHandler({
            type: event,
            scope: null,
            get: function (name) {
                return params[name];
            }
        });
    }

    /**
     * Path matching function
     *
     * @param {String} currentPath
     * @param {String[]} filters (similar to gitignore format)
     * @private
     */
    function _fsMatch(currentPath, filters) {
        var
            result = false,
            sep = _path.sep;
        filters.every(function (filter) {
            var
                match,
                lastPos,
                pos;
            match = filter.charAt(0) !== "!";
            if (!match) {
                filter = filter.subtr(0);
            }
            if (-1 === filter.indexOf("/")) {
                if (currentPath.indexOf(filter)) {
                    result = match;
                    return false; // stop
                }
            } else {
                // TODO improve handling of **, starting / and folders
                filter = _path.normalize(filter).split("*");
                lastPos = -1;
                if (filter.every(function (filterPart) {
                    var firstPart = -1 === lastPos
                                    && filterPart.charAt(0) === sep;
                    if (firstPart) {
                        // Remove starting separator
                        filterPart = filterPart.substr(1);
                    }
                    if (-1 === filterPart.indexOf(sep)) {
                        // No separator, we should match the file name
                        if (lastPos !== currentPath.lastIndexOf(sep) + 1) {
                            return false; // We didn't match the whole path
                        }
                    }
                    pos = currentPath.indexOf(filterPart, lastPos);
                    if (firstPart && 0 !== pos) {
                        return false; // must match the beginning of the path
                    }
                    lastPos = pos + filterPart.length;
                    return -1 !== pos; // stop if not found
                })) {
                    result = match;
                    return false; // stop
                }
            }
            return true; // loop
        });
        return result;
    }

    /**
     * Find and identify files matching the pattern, trigger a file event
     * when a file is found
     * @param {String} basePath
     * @param {String[]} filters Patterns of files to detect
     * @param {gpf.events.Handler} eventsHandler
     *
     * @event file
     * @eventParam {String} path
     *
     * @event done
     */
    function _fsForEach(basePath, filters, eventsHandler) {
        var
            pendingCount = 0;
        function _explore(currentPath) {
            ++pendingCount;
            _fs.stat(currentPath, function (err, stat) {
                if (err) {
                    console.error(err);
                } else if (stat && stat.isDirectory()) {
                    // Folder
                    ++pendingCount;
                    _fs.readdir(currentPath, function (err, list) {
                        var
                            len,
                            idx;
                        if (err) {
                            console.error(err);
                        } else {
                            len = list.length;
                            for (idx = 0; idx < len; ++idx) {
                                _explore(_path.join(currentPath, list[idx]));
                            }
                        }
                        if (0 === --pendingCount) {
                            _gpfEventsFire("done", null, eventsHandler);
                        }
                    });
                } else {
                    if (_fsMatch(currentPath, filters)) {
                        _gpfEventsFire("file", {
                            path: currentPath
                        }, eventsHandler);
                    }
                }
                if (0 === --pendingCount) {
                    _gpfEventsFire("done", null, eventsHandler);
                }
            });
        }
        _explore(basePath);
    }

    //endregion

    //region Source processing

    var
        _currentSource,
        _currentAst,
        _warnings = [],
        _errors = [];

    /**
     * warning implementation
     *
     * @param {String} message
     * @private
     */
    function _warning (message) {
        var line = _currentAst.loc.start.line;
        _warnings.push({
            source: _currentSource,
            line: line,
            message: message
        });
        console.warn(_currentSource + ":" + line + ": WARNING " + message);
    }

    /**
     * error implementation
     *
     * @param {String} message
     * @private
     */
    function _error (message) {
        var line = _currentAst.loc.start.line;
        _errors.push({
            source: _currentSource,
            line: line,
            message: message
        });
        console.error(_currentSource + ":" + line + ": ERROR " + message);
    }

    /**
     * getChildrenOfAST implementation
     *
     * @param {Object} ast
     * @private
     */
    function _children (ast) {
        if (ast.type === "ExpressionStatement") {
            return ast.expression;
        } else if (ast.type === "CallExpression") {
            return ast.callee;
            // ignore arguments
        } else {
            // default
            return ast.body; // may be undefined
        }
    }

    /**
     * Walk down the AST structure and apply rules
     *
     * @param {Object} ast
     * @param {Array} parents
     */
    function _walk(ast, ancestors) {
        var
            children,
            len,
            idx;
        _currentAst = ast;
        _rules.forEach(function (rule) {
            if (rule.match(ast)) {
                rule.test(ast, ancestors);
            }
        });
        children = _children(ast);
        if (children) {
            ancestors.unshift(ast);
            if (children instanceof Array) {
                len = children.length;
                for (idx = 0; idx < len; ++idx) {
                    _walk(children[idx], ancestors);
                }
            } else {
                _walk(children, ancestors);
            }
            ancestors.shift();
        }
    }

    /**
     * Process a source
     *
     * @param {Object} event -- will be an gpf.events.Event
     * @private
     */
    function _processSource(event) {
        if ("done" === event.type) {
            _gpfEventsFire(exports.EVENT_DONE, {
                warnings: _warnings,
                errors: _errors
            }, _eventsHandler);

        } else if ("file" === event.type) {
            var path = event.get("path"),
                ast;
            if (_config.verbose) {
                console.log(path);
            }
            ast = _esprima.parse(_fs.readFileSync(path).toString(), {
                loc: true // Nodes have line and column-based location info
            });
            if (_config.keepAst) {
                _fs.writeFileSync(path + ".ast", JSON.stringify(ast));
            }
            _currentSource = path;
            _walk(ast, []);
        }
    }

    //endregion

    //region Rule processing

    var
        _rules = [],
        _currentRuleName;

    /**
     * rule implementation
     *
     * @param {String} name
     * @param {Function} callback
     * @private
     */
    function _rule (name, callback) {
        if (_config.verbose) {
            console.log("\trule: " + name);
        }
        _currentRuleName = name;
        callback();
    }

    /**
     * match implementation
     *
     * @param {Function} match
     * @param {Function} callback
     * @private
     */
    function _match (match, callback) {
        _rules.push({
            rule: _currentRuleName,
            match: match,
            test: callback
        });
    }

    /**
     * Read a rule or chain to source processing
     *
     * @param {Object} event -- will be an gpf.events.Event
     * @private
     */
    function _processRule(event) {
        if ("done" === event.type) {
            // Process sources
            global.warning = _warning;
            global.error = _error;
            global.getChildrenOfAST = _children;
            _fsForEach(".", _config.files, _processSource);

        } else if ("file" === event.type) {
            var path = event.get("path"),
                src = _fs.readFileSync(path).toString();
            if (_config.verbose) {
                console.log(path);
            }
            /*jslint evil: true*/
            eval(src);
            /*jslint evil: false*/
        }
    }

    //endregion

    //region Interface

    /**
     * Provide the configuration file,
     * see README.md
     *
     * @param {Object} configuration
     */
    exports.initConfig= function (configuration) {
        _config = configuration;
    };

    /**
     * Runs the checker and generates events
     *
     * @param {gpf.events.Handler} eventsHandler
     */
    exports.run = function (eventsHandler) {
        _eventsHandler = eventsHandler;
        // Starts by loading rules
        global.rule = _rule;
        global.match = _match;
        _fsForEach(".", _config.rules, _processRule);
    };

    exports.EVENT_DONE = "done";

    //endregion

}(module.exports));