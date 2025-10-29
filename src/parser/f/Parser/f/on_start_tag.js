
export default (
    function(token) {
        return (
            (this.skipNextNewLine = false),
            this.process_start_tag((this.currentToken = token)),

            token.selfClosing
            &&
            token.ackSelfClosing
            ||
            this.err(
                token,
                this.ERR.nonVoidHtmlElementStartTagWithTrailingSolidus
            ),

            this
        );
    }
);
