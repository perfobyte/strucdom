export default (
    function(current, tid) {
        return (
            (
                this.tokenizer.inForeignNode = (
                    (this.currentNotInHTML = !(
                        (current === this.document)
                        ||
                        (current && ((current).namespaceURI === this.NS.HTML))
                    ))
                    &&
                    (current !== undefined)
                    &&
                    (tid !== undefined)
                    &&
                    (!(this.is_integration_point(tid, current)))
                )
            ),

            this
        );
    }
);
