let program = _(
    _let('fib')(_fun('a', 'b', 'count')(
        _if (_('count','<',0))
            (_return('a'))
            (
                _('fib', 'b', _('a','+','b'), _('count','-',1))
            )
    )),
    _('fib', 0, 1, 'c')
);