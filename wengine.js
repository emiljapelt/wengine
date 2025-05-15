const execute = function (ast, env) {
  switch (ast.node) {
    case 'if': {
      if (execute(ast.cond, env)) return execute(ast.then, env);
      else return execute(ast.else, env);
    }
    case 'var': {
      for (
        let scope_index = env.binds.length - 1;
        scope_index >= 0;
        scope_index--
      ) {
        const scope = env.binds[scope_index];
        for (let index = scope.length - 1; index >= 0; index--) {
          if (scope[index][0] === ast.name) return scope[index][1];
        }
      }
      break;
    }
    case 'const': {
      return ast.value;
    }
    case 'block': {
      env.binds.push([]);
      for (const node of ast.body) {
        execute(node, env);
        if (env.return !== undefined || env.breaking || env.continuing) 
          break;
      }
      env.binds.pop();
      break;
    }
    case 'while': {
      env.in_loop++;
      while(execute(ast.cond, env)) {
        execute(ast.body, env);
        if (env.return !== undefined) {
          env.binds.pop();
          env.in_loop++;
          return;
        }
        if (env.breaking) {
          env.breaking = false;
          break;
        }
        env.continuing = false;
        if (ast.incr) execute(ast.incr, env);
      }
      env.in_loop--;
      break;
    }
    case 'return': {
      env.ret = execute(ast.expr, env);
      break;
    }
    case 'let': {
      env.binds[env.binds.length - 1].push([
        ast.name,
        execute(ast.expr, env),
      ]);
      break;
    }
    case 'set': {
      for (
        let scope_index = env.binds.length - 1;
        scope_index >= 0;
        scope_index--
      ) {
        const scope = env.binds[scope_index];
        for (let index = scope.length - 1; index >= 0; index--) {
          if (scope[index][0] !== ast.name) continue; 
          scope[index][1] = execute(ast.expr, env);
          return;
        }
      }
      break;
    }
    case 'call': {
      let f = execute(ast.func, env);
      let args = [];
      for (let i = 0; i < f.params.length; i++)
        args.push([f.params[i], execute(ast.args[i], env)]);
      env.binds.push(args);
      execute(f, env);
      let result = env.ret;
      env.return = undefined;
      env.binds.pop();
      return result;
    }
    case 'print': {
      console.log(execute(ast.expr, env));
      break;
    }
    case 'break': {
      if (env.in_loop > 0) env.breaking = true;
      break;
    }
    case 'continue': {
      if (env.in_loop > 0) env.continuing = true;
      break;
    }
    case '+': return execute(ast.left, env) + execute(ast.right, env);
    case '-': return execute(ast.left, env) - execute(ast.right, env);
    case '*': return execute(ast.left, env) * execute(ast.right, env);
    case '=': return execute(ast.left, env) === execute(ast.right, env);
    case '<': return execute(ast.left, env) < execute(ast.right, env);
    case '!': return !execute(ast.expr, env);
  }
};

const env = (args) => {
  return { binds: [args === undefined ? [] : args], ret: undefined, in_loop: 0, breaking: false, continuing: false };
};



// example use: run(program, ['a': 2], ['b': true])
const run = (program, ...args) => {
  if (typeof _wengine_validate !== 'undefined')
    _wengine_validate(program, _wengine_all_nodes, env(...args));
  if (typeof _wengine_type !== 'undefined')
    _wengine_type(program, ...args);
  let environment = env(args);
  switch (typeof program) {
    case 'string':
      execute(JSON.parse(program), environment);
      break;
    case 'object':
      execute(program, environment);
      break;
    default:
      console.log('Mothor does not know how to run that...');
  }
  return environment.ret;
};
