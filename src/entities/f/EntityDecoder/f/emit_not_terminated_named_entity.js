

export default (
    function() {
        var
            result = this.result,
            decodeTree = this.decodeTree
        ;
        return (
            this.emitNamedEntityData(
                result,
                ((decodeTree[result] & this.BinTrieFlags.VALUE_LENGTH) >> 14),
                this.consumed
            ),
            this.errors?.missingSemicolonAfterCharacterReference(),
            this.consumed
        );
    }
);
