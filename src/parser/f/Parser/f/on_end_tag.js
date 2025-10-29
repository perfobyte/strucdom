export default (
    function(token) {
        return (
            (this.skipNextNewLine = false),
            (this.currentToken = token),

            (this.currentNotInHTML)
            ? this.end_tag_in_foreign_content(this, token)
            : this.end_tag_outside_foreign_content(token),

            this
        );
    }
);
