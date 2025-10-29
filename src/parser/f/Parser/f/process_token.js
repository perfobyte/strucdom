

export default (
    function(token) {
        var
            t = token.type,
            TokenType = this.TokenType
        ;
        return (
            (t === TokenType.CHARACTER)
            ? this.on_character(token)
            :
            (t === TokenType.NULL_CHARACTER)
            ? this.on_null_character(token)
            :
            (t === TokenType.COMMENT)
            ? this.on_comment(token)
            :
            (t === TokenType.DOCTYPE)
            ? this.on_doctype(token)
            :
            (t === TokenType.START_TAG)
            ? this.process_start_tag(token)
            :
            (t === TokenType.END_TAG)
            ? this.on_end_tag(token)
            :
            (t === TokenType.EOF)
            ? this.on_eof(token)
            :
            (t === TokenType.WHITESPACE_CHARACTER)
            &&
            this.on_whitespace_character(token),

            this
        );
    }
)