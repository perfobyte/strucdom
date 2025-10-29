

export default (
    function(token) {
        var
            i = 0,
            m = this.InsertionMode
        ;
        return (
            (this.skipNextNewLine = false),

            ((i = this.insertionMode) === m.INITIAL)
            ? this.doctype_in_initial_mode(this, token)
            :
            (
                (i === m.BEFORE_HEAD) ||
                (i === m.IN_HEAD) ||
                (i === m.IN_HEAD_NO_SCRIPT) ||
                (i === m.AFTER_HEAD)
            )
            ? (
                this.err(token, this.ERR.misplacedDoctype)
            )
            :
            (i === m.IN_TABLE_TEXT)
            ? this.token_in_table_text(this, token)
            : null
        );
    }
)