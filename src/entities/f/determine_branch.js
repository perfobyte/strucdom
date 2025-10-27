import {BinTrieFlags} from '../conf/i.js';

export default (
    (decodeTree, current, nodeIndex, char) => {
        var
            branchCount = ((current & BinTrieFlags.BRANCH_LENGTH) >> 7),
            jumpOffset = (current & BinTrieFlags.JUMP_TABLE),
            value = 0,
            v = -1,

            mid = 0,
            midKey = 0
        ;
        a: {
            if (branchCount === 0) {
                v = jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
                break a;
            }
            else if (jumpOffset) {
                v = (
                    (
                        ((value = char - jumpOffset) < 0)
                        ||
                        (value >= branchCount)
                    )
                    ? -1
                    : decodeTree[nodeIndex + value] - 1
                );
                break a;
            }
            
            value = 0;
            jumpOffset = (branchCount - 1);
            branchCount = ((branchCount + 1) >> 1);

            while (value <= jumpOffset) {
                
                midKey = (
                    (
                        (
                            decodeTree[
                                nodeIndex
                                + (
                                    (
                                        mid = (
                                            (
                                                value
                                                + jumpOffset
                                            ) >>> 1
                                        )
                                    ) >> 1
                                )
                            ]
                        ) >> (
                            (
                                mid
                                & 1
                            )
                            * 8
                        )
                    )
                    & 0xff
                )
                
                if (midKey < char) {
                    value = mid + 1;
                }
                else if (midKey > char) {
                    jumpOffset = mid - 1;
                }
                else {
                    v = decodeTree[nodeIndex + branchCount + mid];
                    break a;
                }
            }
        }

        return v;
    }
);
