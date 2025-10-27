

export default (
    function(input, offset) {
        var
            decodeTree = this.decodeTree,
            BinTrieFlags = this.BinTrieFlags,
            CharCodes = this.CharCodes,
            DecodingMode = this.DecodingMode,

            current = decodeTree[this.treeIndex],
            
            valueLength = ((current & BinTrieFlags.VALUE_LENGTH) >> 14),
            l = input.length,

            runLength = 0,
            firstChar = 0,
            remaining = 0,
            runPos = 0,
            packedWord = 0,

            char = 0,

            v = -1
        ;
        
        a: while (offset < l) {
            if (
                (valueLength === 0) && (current & BinTrieFlags.FLAG13) !== 0
            ) {
                runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
                firstChar = current & BinTrieFlags.JUMP_TABLE;
                if (offset + runLength > l) {
                    v = -1;
                    break a;
                }
                if (input.charCodeAt(offset) !== firstChar) {
                    v = (
                        (this.result === 0)
                        ? 0
                        : this.emit_not_terminated_named_entity()
                    );
                    break a;
                }
                offset++;
                this.excess++;
                remaining = runLength - 1;
                runPos = 1;
                for (; runPos < runLength; runPos += 2) {
                    
                    if (input.charCodeAt(offset) !== (
                        (
                            packedWord = decodeTree[this.treeIndex + 1 + ((runPos - 1) >> 1)]
                        ) & 0xff
                    )) {
                        v = (
                            (this.result === 0)
                            ? 0
                            : this.emitNotTerminatedNamedEntity()
                        );
                        break a;
                    }
                    offset++;
                    this.excess++;
                    if ((runPos + 1) < runLength) {
                        if (input.charCodeAt(offset) !== ((packedWord >> 8) & 0xff)) {
                            v = (
                                (this.result === 0)
                                ? 0
                                : this.emitNotTerminatedNamedEntity()
                            )
                            break a;
                        }
                        offset++;
                        this.excess++;
                    }
                }
                current = decodeTree[this.treeIndex += (1 + ((remaining + 1) >> 1))];
                valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
            }
            if (offset >= input.length) {
                break a;
            }
            ;
            if (
                ((char = input.charCodeAt(offset)) === CharCodes.SEMI)
                &&
                (valueLength !== 0)
                &&
                ((current & BinTrieFlags.FLAG13) !== 0)
            ) {
                v =
                    this.emitNamedEntityData(
                        this.treeIndex,
                        valueLength,
                        (this.consumed + this.excess)
                    )
                ;
                break a;
            }
            ;
            if (
                (
                    this.treeIndex =
                        this.determine_branch(
                            decodeTree,
                            current,
                            (this.treeIndex + Math.max(1, valueLength)),
                            char
                        )
                ) < 0
            ) {
                v = (
                    (this.result === 0)
                    ||
                    (
                        (this.decodeMode === DecodingMode.Attribute)
                        &&
                        (
                            (valueLength === 0)
                            ||
                            this.is_entity_in_attribute_invalid_end(char)
                        )
                    )
                    ? 0
                    : this.emitNotTerminatedNamedEntity()
                );
                break a;
            }
            
            if (
                (
                    valueLength = (
                        (
                            (
                                current = decodeTree[this.treeIndex]
                            )
                            & BinTrieFlags.VALUE_LENGTH
                        ) >> 14
                    )
                ) !== 0
            ) {
                if (char === CharCodes.SEMI) {
                    v =
                        this.emitNamedEntityData(
                            this.treeIndex,
                            valueLength,
                            (this.consumed + this.excess)
                        )
                    ;
                    break a;
                }
                if (
                    (this.decodeMode !== DecodingMode.Strict)
                    &&
                    ((current & BinTrieFlags.FLAG13) === 0)
                ) {
                    this.result = this.treeIndex;
                    this.consumed += this.excess;
                    this.excess = 0;
                }
            }
            offset++;
            this.excess++;
        }
        return v;
    }
);
