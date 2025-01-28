let program = _(
    _loop(_('a','<',100)) (
        _out('a'),
        _set('a')(_('a','+',1))
    )
);