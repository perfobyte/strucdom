

export default (
    function(
        referenceElement,
        newElement,
        newElementID
    ) {
        var
            insertionIdx = (this.index_of(referenceElement) + 1),
            stackTop = (++this.stackTop),
            current = (this.current),

            currentTagId = this.currentTagId
        ;
        return (
            this.items.splice(insertionIdx, 0, newElement),
            this.tagIDs.splice(insertionIdx, 0, newElementID),

            (insertionIdx === stackTop)
            &&
            this.update_current_element(),

            (current)
            &&
            (currentTagId === undefined)
            ||
            (
                this.handler.onItemPush(
                    current,
                    currentTagId,
                    (insertionIdx === stackTop)
                )
            ),

            this
        );
    }
)