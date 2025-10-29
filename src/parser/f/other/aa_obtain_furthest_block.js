
export default (
    (p, formattingElementEntry) => {
        var
            furthestBlock = null,
            openElements = p.openElements,
            idx = openElements.stackTop,
            tagIDs = openElements.tagIDs,
            items = openElements.items,
            element = null
        ;
        for (; idx >= 0; idx--) {
            if (
                (element = items[idx]) === (formattingElementEntry.element)
            ) {
                break;
            };

            (p.is_special_element(element, tagIDs[idx]))
            &&
            (
                furthestBlock = element
            );
        }
        return (
            furthestBlock
            ||
            (
                openElements.shorten_to_length(Math.max(idx, 0)),
                p.activeFormattingElements.removeEntry(formattingElementEntry)
            ),

            furthestBlock
        );
    }
);
