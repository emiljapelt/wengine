var __generated_var_count__ = 0;
const _generate_var_ = () => `${__generated_var_count__++}_var`;

const _if = (..._data) => {
    switch (_data.length)  {
        case 1:
            return (..._then) => (..._else) => { 
                return { node: 'if', cond:_data[0], then:{ node: 'block', body:_then }, else:{ node: 'block', body:_else } }; 
            }
        case 2:
            return { node: 'if', cond:_data[0], then:{ node: 'block', body:[_data[1]] }, else:{ node: 'block', body:[] } }; 
        default:
            return { node: 'if', cond:_data[0], then:{ node: 'block', body:[_data[1]] }, else:{ node: 'block', body:data.slice(2) } }; 
    }
};

const _v = (_name) => {
    return { node: 'var', name:_name};
};

const _c = (_value) => {
    return { node: 'const', value:_value};
};

const _fun = (...params) => (...body) => {
    return { node: 'const', value: { node: 'block', params:params, body:body }  };
};

const _ = (...data) => {
    switch (data.length) {
        case 1: switch (typeof data[0]) {
            case 'boolean':
            case 'number': return { node: 'const', value:data[0]};
            case 'string': return { node: 'var', name:data[0]};
            case 'object': return data[0];
            break;
        }
        case 2: {
            if (typeof data[0] === 'string') {
                switch (data[0]) {
                    case '!': return _un(data[0])(data[1]);
                    default: return _call(data[0])(data[1]);
                }
            }
            break;
        }
        case 3: {
            if (typeof data[1] === 'string') {
                switch (data[1]) {
                    case '!=':
                        return _un('!')(_bin(data[0])('=')(data[2]))
                    case '>':
                        return _bin(data[2])(data[1])(data[0]);
                    case '<=':
                        return _un('!')(_bin(data[2])('<')(data[0]));
                    case '>=':
                        return _un('!')(_bin(data[0])('<')(data[2]));
                    default: /*  +  -  *  =  <  */
                        return _bin(data[0])(data[1])(data[2]);
                }
            }
            break;
        }
        default: {
            if (typeof data[0] === 'string') 
                return _call(data[0])(data.slice(1));
        }
    }
    return { node: 'block', body:data };
}

const _return = (_expr) => {
    if (_expr === undefined)
        return { node: 'return', expr:_(_c()) };
    return { node: 'return', expr:_(_expr) };
};
_return['node'] = 'return';
_return['expr'] = _(_c());

const _let = (_name) => (_expr) => {
    return { node: 'let', name:_name, expr:_(_expr) };
}

const _set = (_name) => (_expr) => {
    return { node: 'set', name:_name, expr:_(_expr) };
};

const _call = (_func) => (...args) => {
    return { node: 'call', func:_(_func), args:args.map(a => _(a)) };
};

const _while = (_cond, _incr) => (...body) => {
    return { node: 'while', cond:_(_cond), incr:_incr, body:_(...body) }
};

const _loop = (_cond) => (...body) => {
    switch (typeof _cond) {
        case 'string':
        case 'number': {
            var increaser = _generate_var_();
            var limiter = _generate_var_();
            return _(
                _let(increaser)(0),
                _let(limiter)(_(_cond)),
                _while(_(increaser,'<',limiter), _set(increaser)(_(increaser,'+',1)) )(...body)
            )
        }
        case 'undefined': return _while(_c(1))(...body);
        default: return _while(_cond)(...body);
    }
};

const _out = (_expr) => {
    return { node: 'print', expr:_(_expr) };
};

const _bin = (_left) => (_op) => (_right) => {
    return { node:_op, left:_(_left), right:_(_right) };
};

const _un = (_op) => (_expr) => {
    return { node:_op, expr:_(_expr) };
};

const _break = { node: 'break' };
const _continue = { node: 'continue' };