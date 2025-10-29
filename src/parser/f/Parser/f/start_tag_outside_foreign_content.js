

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
            ? this.start_tag_before_html(this, token)
            :
            (a === m.BEFORE_HEAD)
            ? this.start_tag_before_head(this, token)
            :
            (a === m.IN_HEAD)
            ? this.start_tag_in_head(this, token)
            :
            (a === m.IN_HEAD_NO_SCRIPT)
            ? this.start_tag_in_head_no_script(this, token)
            :
            (a === m.AFTER_HEAD)
            ? this.start_tag_after_head(this, token)
            :
            (a === m.IN_BODY)
            ? this.start_tag_in_body(this, token)
            :
            (a === m.IN_TABLE)
            ? this.start_tag_in_table(this, token)
            :
            (a === m.IN_TABLE_TEXT)
            ? this.token_in_table_text(this, token)
            :
            (a === m.IN_CAPTION)
            ? this.start_tag_in_caption(this, token)
            :
            (a === m.IN_COLUMN_GROUP)
            ? this.start_tag_in_column_group(this, token)
            :
            (a === m.IN_TABLE_BODY)
            ? this.start_tag_in_table_body(this, token)
            :
            (a === m.IN_ROW)
            ? this.start_tag_in_row(this, token)
            :
            (a === m.IN_CELL)
            ? this.start_tag_in_cell(this, token)
            :
            (a === m.IN_SELECT)
            ? this.start_tag_in_select(this, token)
            :
            (a === m.IN_SELECT_IN_TABLE)
            ? this.start_tag_in_select_in_table(this, token)
            :
            (a === m.IN_TEMPLATE)
            ? this.start_tag_in_template(this, token)
            :
            (a === m.AFTER_BODY)
            ? this.start_tag_after_body(this, token)
            :
            (a === m.IN_FRAMESET)
            ? this.start_tag_in_frameset(this, token)
            :
            (a === m.AFTER_FRAMESET)
            ? this.start_tag_after_frameset(this, token)
            :
            (a === m.AFTER_AFTER_BODY)
            ? this.start_tag_after_after_body(this, token)
            :
            (a === m.AFTER_AFTER_FRAMESET)
            ? this.start_tag_after_after_frameset(this, token)
            : null
        );
    }
)