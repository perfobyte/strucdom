

export default (
    function(tagName) {
        var
            entries = this.entries,
            EntryType = this.EntryType,
            
            Element = EntryType.Element,
            Marker = EntryType.Marker,

            entry = null,
            v = null,

            i = 0,
            l = entries.length,

            type = 0
        ;
        for (;i<l;i++) {
            
            if (
                ((type = (entry = entries[i]).type) === Marker)
                ||
                ((entry.element.tagName) === tagName)
            ) {
                v = (
                    (
                        (entry)
                        &&
                        (type === Element)
                    )
                    ? entry
                    : null
                );
                break;
            }
        };

        return v;
    }
)