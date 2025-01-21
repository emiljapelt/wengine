let program = _(
    _let('a')(0),
    _loop() (
        _out('a'),
        _continue,
        _set('a')(_('a','+',1))
    )
);