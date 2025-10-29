import {append_child, create_element} from '../../../tree_adapters/i.js';

export default (
    (p, furthestBlock, formattingElementEntry) => {
        var
            e = formattingElementEntry.element,
            oe = p.openElements,

            token = formattingElementEntry.token,
            active = p.activeFormattingElements

            newElement = create_element(token.tagName, (e.namespaceURI), token.attrs)
        ;
        return (
            p.adopt_nodes(furthestBlock, newElement),
            append_child(furthestBlock, newElement),

            active.insertElementAfterBookmark(newElement, token),
            active.removeEntry(formattingElementEntry),

            oe.remove(e),
            oe.insertAfter(furthestBlock, newElement, token.tagID)
        );
    }
)