
export default (
    function() {
        var
            InsertionMode = this.InsertionMode,
            TokenizerMode = this.TokenizerMode
        ;
        return (
            (this.insertionMode = InsertionMode.TEXT),
            (this.originalInsertionMode = InsertionMode.IN_BODY),
            (this.tokenizer.state = TokenizerMode.PLAINTEXT),
            this
        );
    }
);
