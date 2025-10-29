import generic_end_tag_in_body from './generic_end_tag_in_body.js';


export default (
    (p, token) => {
        var
            active = p.activeFormattingElements,

            formattingElementEntry = (
                active
                .getElementEntryInScopeWithTagName(
                    token
                    .tagName
                )
            )
        ;
        return (
            formattingElementEntry
            ? (
                p.openElements.contains(formattingElementEntry.element)
                ? (
                    p.openElements.hasInScope(token.tagID)
                    ||
                    (
                        formattingElementEntry = null        
                    )
                )
                : (
                    active.removeEntry(formattingElementEntry),
                    (formattingElementEntry = null)
                )
            )
            : (
                generic_end_tag_in_body(p, token)
            ),
            formattingElementEntry
        );
    }
)