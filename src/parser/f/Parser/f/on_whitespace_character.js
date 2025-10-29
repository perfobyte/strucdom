

export default (
    function(token) {
        var
            chars = token.chars,
            m = this.InsertionMode,
            a = 0

        ;
        a: {
            if (this.skipNextNewLine) {
                
                if (chars.charCodeAt(0) === this.CODE_POINTS.LINE_FEED) {
                    if (chars.length === 1) {
                        break a;
                    }
                    token.chars = chars.substr(1);
                }
            }
            if (this.tokenizer.inForeignNode) {
                this.insert_characters(token);
                break a;
            }

            (
                ((a = this.insertionMode) === m.IN_HEAD) ||
                (a === m.IN_HEAD_NO_SCRIPT) ||
                (a === m.AFTER_HEAD) ||
                (a === m.TEXT) ||
                (a === m.IN_COLUMN_GROUP) ||
                (a === m.IN_SELECT) ||
                (a === m.IN_SELECT_IN_TABLE) ||
                (a === m.IN_FRAMESET) ||
                (a === m.AFTER_FRAMESET)
            )
            ? this.insert_characters(token)
            :
            (
                (a === m.IN_BODY) ||
                (a === m.IN_CAPTION) ||
                (a === m.IN_CELL) ||
                (a === m.IN_TEMPLATE) ||
                (a === m.AFTER_BODY) ||
                (a === m.AFTER_AFTER_BODY) ||
                (a === m.AFTER_AFTER_FRAMESET)
            )
            ? this.whitespace_character_in_body(this, token)
            :
            (
                (a === m.IN_TABLE) ||
                (a === m.IN_TABLE_BODY) ||
                (a === m.IN_ROW)
            )
            ? this.character_in_table(this, token)
            :
            (
                a === m.IN_TABLE_TEXT
            )
            && this.whitespace_character_in_table_text(this, token);

        };
        return this;
    }
)