

export default (
    function(newElement, neAttrs) {
        var
            candidates = [],
            neAttrsLength = neAttrs.length,

            neTagName = (newElement.tagName),

            neNamespaceURI = ((newElement).namespaceURI),

            idx = 0,
            entries = this.entries,
            l = entries.length,

            entry = null,

            Marker = this.EntryType.Marker,
            element = null,
            elementAttrs = null
        ;
        
        for (; idx < l; idx++) {
            if (
                (entry = entries[idx]).type === Marker
            ) {
                break;
            }
            
            (((element = entry.element).tagName) === neTagName)
            &&
            ((element.namespaceURI) === neNamespaceURI)
            &&
            (((elementAttrs = (element.attrs)).length) === neAttrsLength)
            &&
            (candidates.push({ idx, attrs: elementAttrs }));
        }
        return candidates;
    }
);
