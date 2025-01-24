let program = _(
    _let('f')(_fun('a')(
        _if (_('a','<=',0))
            (_return())
            (
                _out('a'),
                _('f', _('a','-',1))
            )
    )),
    _('f', 'a'),
);