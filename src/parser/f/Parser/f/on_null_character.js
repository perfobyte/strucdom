

export default (
    function(token) {
        var
            i = 0,
            m = this.InsertionMode
        ;
        return (
            (this.skipNextNewLine = false),

            (this.tokenizer.inForeignNode)
            ? (
                this.null_character_in_foreign_content(this, token),
                null
            )
            : (
                ((i = this.insertionMode) === m.INITIAL)
                ? this.token_in_initial_mode(this, token)
                :
                (i === m.BEFORE_HTML)
                ? this.token_before_html(this, token)
                :
                (i === m.BEFORE_HEAD)
                ? this.token_before_head(this, token)
                :
                (i === m.IN_HEAD)
                ? this.token_in_head(this, token)
                :
                (i === m.IN_HEAD_NO_SCRIPT)
                ? this.token_in_head_no_script(this, token)
                :
                (i === m.AFTER_HEAD)
                ? this.token_after_head(this, token)
                :
                (i === m.TEXT)
                ? this.insert_characters(token)
                :
                (
                    (i === m.IN_TABLE)
                    ||
                    (i === m.IN_TABLE_BODY)
                    ||
                    (i === m.IN_ROW)
                )
                ? this.character_in_table(this, token)
                :
                (i === m.IN_COLUMN_GROUP)
                ? this.token_in_column_group(this, token)
                :
                (i === m.AFTER_BODY)
                ? this.token_after_body(this, token)
                :
                (i === m.AFTER_AFTER_BODY)
                ? this.token_after_after_body(this, token)
                : null
            )
        );
    }
);
