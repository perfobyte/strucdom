

export default (
    function(
        currentToken,
        nextTokenizerState
    ) {
        return (
            this.insert_element(currentToken, this.NS.HTML),
            (this.tokenizer.state = nextTokenizerState),
            (this.originalInsertionMode = this.insertionMode),
            (this.insertionMode = this.InsertionMode.TEXT),
            this
        )
    }
);
