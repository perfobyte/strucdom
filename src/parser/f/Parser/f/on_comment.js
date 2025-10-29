

export default (
    function(token) {
        var
            m = this.InsertionMode,
            a = 0
        ;
        return (
            (this.skipNextNewLine = false),

            (this.currentNotInHTML)
            ? (
                this.append_comment(this, token),
                null
            )
            :
            (
                ((a = this.insertionMode) === m.INITIAL) ||
                (a === m.BEFORE_HTML) ||
                (a === m.BEFORE_HEAD) ||
                (a === m.IN_HEAD) ||
                (a === m.IN_HEAD_NO_SCRIPT) ||
                (a === m.AFTER_HEAD) ||
                (a === m.IN_BODY) ||
                (a === m.IN_TABLE) ||
                (a === m.IN_CAPTION) ||
                (a === m.IN_COLUMN_GROUP) ||
                (a === m.IN_TABLE_BODY) ||
                (a === m.IN_ROW) ||
                (a === m.IN_CELL) ||
                (a === m.IN_SELECT) ||
                (a === m.IN_SELECT_IN_TABLE) ||
                (a === m.IN_TEMPLATE) ||
                (a === m.IN_FRAMESET) ||
                (a === m.AFTER_FRAMESET)
            )
            ? this.append_comment(this, token)
            :
            (a === m.IN_TABLE_TEXT)
            ? this.token_in_table_text(this, token)
            :
            (a === m.AFTER_BODY)
            ? this.append_comment_to_root_html_element(this, token)
            :
            (
                (a === m.AFTER_AFTER_BODY)
                ||
                (a === m.AFTER_AFTER_FRAMESET)
            )
            ? this.append_comment_to_document(this, token)
            : null
        );
    }
)
