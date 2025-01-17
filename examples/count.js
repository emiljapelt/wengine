let program = _(
    _let('f')(_fun('a')(
        _if (_('a','<',0))
            (_return(_c()))
            (
                _out('a'),
                _call('f')(_('a','-',1))
            )
    )),
    _call('f')('a')
);   