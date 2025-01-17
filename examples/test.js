let program = _(
    _let('decrease')(_fun()(
        _set('a')(_('a','-', 1))
    )),
    _while('a') (
        _out('a'),
        _call('decrease')()
    )
);