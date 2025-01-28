const _wengine_expr_nodes = [ 'var', 'const', 'call', '+', '-', '*', '=', '<', '!'];
const _wengine_stmt_nodes = [ 'if', 'block', 'while', 'return', 'let', 'set', 'call', 'print', 'break', 'continue' ];
const _wengine_all_nodes = [ ..._wengine_expr_nodes, ..._wengine_stmt_nodes ];
const _wengine_invalid = (msg) => { throw new Error(`Wengine invalid AST: ${msg}`); };
const _wengine_require_keys = (ast, ...reqs) => { 
    for (const req of reqs)
        if (!(req in ast)) 
            _wengine_invalid(`Expected object key: ${req}`) 
};
const _wengine_validate = (ast, allowed_nodes, env) => {
    if (!('node' in ast)) _wengine_invalid("Expected AST node");
    if (!(allowed_nodes.includes(ast.node))) _wengine_invalid(`${ast.node} not allowed in ${ast.node}`);
    switch(ast.node) {
        case 'if': {
            _wengine_require_keys(ast, 'cond', 'then', 'else');
            _wengine_validate(ast.cond, _wengine_expr_nodes, env);
            _wengine_validate(ast.then, _wengine_stmt_nodes, env);
            _wengine_validate(ast.else, _wengine_stmt_nodes, env);
          }
          case 'var': {
            _wengine_require_keys(ast, 'name');
            for (
              let scope_index = env.binds.length - 1;
              scope_index >= 0;
              scope_index--
            ) {
              const scope = env.binds[scope_index];
              for (let index = scope.length - 1; index >= 0; index--) {
                if (scope[index][0] === ast.name) return;
              }
            }
            break;
          }
          case 'const': {
            _wengine_require_keys(ast, 'value');
            switch (typeof ast.value) {
                case 'boolean':
                case 'number': return;
                default: _wengine_invalid(`Unsupported constant: ${ast.value}`);
            }
          }
          case 'block': {
            _wengine_require_keys(ast, 'body');
            env.binds.push([]);
            for (const node of ast.body)
              _wengine_validate(node, _wengine_stmt_nodes, env)
            env.binds.pop();
            break;
          }
          case 'while': {
            _wengine_require_keys(ast, 'cond', 'body');
            env.in_loop++;
            _wengine_validate(ast.cond, _wengine_expr_nodes, env);
            _wengine_validate(ast.body, _wengine_stmt_nodes, env);
            if ('incr' in ast && ast.incr !== undefined)
                _wengine_validate(ast.incr, _wengine_stmt_nodes, env);
            env.in_loop--;
            break;
          }
          case 'return': {
            _wengine_require_keys(ast, 'expr');
            _wengine_validate(ast.expr, _wengine_expr_nodes, env);
            break;
          }
          case 'let': {
            _wengine_require_keys(ast, 'name', 'expr');
            _wengine_validate(ast.expr, _wengine_expr_nodes, env);
            env.binds[env.binds.length - 1].push([ast.name]);
            break;
          }
          case 'set': {
            _wengine_require_keys(ast, 'name', 'expr');
            _wengine_validate(ast.expr, _wengine_expr_nodes, env);
            for (
              let scope_index = env.binds.length - 1;
              scope_index >= 0;
              scope_index--
            ) {
              const scope = env.binds[scope_index];
              for (let index = scope.length - 1; index >= 0; index--) {
                if (scope[index][0] === ast.name) return; 
              }
            }
            _wengine_invalid(`Undefined variable: ${ast.name}`);
          }
          case 'call': {
            _wengine_require_keys(ast, 'func', 'args');
            // How to validate ast.func
            for(const arg of ast.args)
                _wengine_validate(ast, _wengine_expr_nodes, env);
            return;
          }
          case 'print': {
            _wengine_require_keys(ast, 'expr');
            _wengine_validate(ast.expr, _wengine_expr_nodes, env);
            break;
          }
          case 'break': {
            if (env.in_loop <= 0) _wengine_invalid("'break' outside loop");
            break;
          }
          case 'continue': {
            if (env.in_loop <= 0) _wengine_invalid("'continue' outside loop");
            break;
          }
          case '+': case '-': case '*': case '=': case '<': {
            _wengine_require_keys(ast, 'left', 'right');
            _wengine_validate(ast.left, _wengine_expr_nodes, env);
            _wengine_validate(ast.right, _wengine_expr_nodes, env);
            break
          }
          case '!': {
            _wengine_require_keys(ast, 'expr');
            _wengine_validate(ast.expr, _wengine_expr_nodes, env);
            break;
          }
    }
};