export default (
    function(element) {
        var
            entries = this.entries,
            i = 0,
            l = entries.length,
            entry = null,
            found_entry = null,

            Element = this.EntryType.Element
        ;
        for (
            ;
            i < l;
            i++
        ) {
            
            if (
                (
                    (
                        entry = entries[i]
                    )
                    .type === Element
                )
                &&
                (
                    entry.element === element
                )
            ) {
                found_entry = entry;
                break;
            }
        }
        return found_entry;
    }
)