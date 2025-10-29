

export default (
    function() {
        var
            ei = 0,
            i = 0,

            entries = null,
            entry = null,
            

            openElements = this.openElements,
            Marker = this.EntryType.Marker,

            i = 0,
            l = 0
        ;
        if (
            l = (
                (
                    entries = this.activeFormattingElements.entries
                )
                .length
            )
        ) {
            for (;i<l;i++) {
                if (
                    ((entry = entries[i]).type === Marker)
                    ||
                    openElements.contains(entry.element)
                ) {
                    ei = i;
                    break;
                }
            };

            i = (
                (ei === -1)
                ? (l - 1)
                : (ei - 1)
            );
            
            for (; i >= 0; i--) {
                this.insert_element(
                    ((entry = entries[i]).token),
                    (entry.element.namespaceURI),
                );
                entry.element = openElements.current;
            };
        }
        return this;
    }
)