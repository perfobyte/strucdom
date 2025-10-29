

export default (
    function(token) {
        var
            a = 0,
            m = this.InsertionMode
        ;
        return (
            ((a = this.insertionMode) === m.INITIAL)
            ? this.token_in_initial_mode(this, token)
            :
            (a === m.BEFORE_HTML)
            ? this.token_before_html(this, token)
            :
            (a === m.BEFORE_HEAD)
            ? this.token_before_head(this, token)
            :
            (a === m.IN_HEAD)
            ? this.token_in_head(this, token)
            :
            (a === m.IN_HEAD_NO_SCRIPT)
            ? this.token_in_head_no_script(this, token)
            :
            (a === m.AFTER_HEAD)
            ? this.token_after_head(this, token)
            :
            (
                (a === m.IN_BODY) ||
                (a === m.IN_TABLE) ||
                (a === m.IN_CAPTION) ||
                (a === m.IN_COLUMN_GROUP) ||
                (a === m.IN_TABLE_BODY) ||
                (a === m.IN_ROW) ||
                (a === m.IN_CELL) ||
                (a === m.IN_SELECT) ||
                (a === m.IN_SELECT_IN_TABLE)
            )
            ? this.eof_in_body(this, token)
            :
            (a === m.TEXT)
            ? this.eof_in_text(this, token)
            :
            (a === m.IN_TABLE_TEXT)
            ? this.token_in_table_text(this, token)
            :
            (a === m.IN_TEMPLATE)
            ? this.eof_in_template(this, token)
            :
            (
                (a === m.AFTER_BODY) ||
                (a === m.IN_FRAMESET) ||
                (a === m.AFTER_FRAMESET) ||
                (a === m.AFTER_AFTER_BODY) ||
                (a === m.AFTER_AFTER_FRAMESET)
            )
            ? this.stop_parsing(this, token)
            : null,

            this
        );
    }
);