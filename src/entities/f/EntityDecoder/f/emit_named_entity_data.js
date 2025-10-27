

export default (
    function(result, valueLength, consumed) {
        var
            decodeTree = this.decodeTree,
            BinTrieFlags = this.BinTrieFlags
        ;
        return (
            this.emit_code_point(
                (valueLength === 1)
                ? (
                    (decodeTree[result])
                    &
                    (~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13))
                )
                : (
                    decodeTree[result + 1]
                ),
                
                consumed
            ),

            (valueLength === 3)
            &&
            (this.emit_code_point(decodeTree[result + 2], consumed)),

            consumed
        );
    }
);