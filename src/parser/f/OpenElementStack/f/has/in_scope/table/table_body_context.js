export default (
    function() {
        var
            i = this.stackTop,

            items = this.items,

            tagIDs = this.tagIDs,

            TI = this.TAG_ID,
            NS = this.NS,

            NS_HTML = NS.HTML,

            TBODY = TI.TBODY,
            THEAD = TI.THEAD,
            TFOOT = TI.TFOOT,

            TABLE = TI.TABLE,
            HTML = TI.HTML,

            tag = 0,

            v = true
        ;

        for (; i >= 0; i--) {
            if (((items[i]).namespaceURI) !== NS_HTML) {
                continue;
            }
            
            if (
                ((tag = tagIDs[i]) === TBODY)
                ||
                (tag === THEAD)
                ||
                (tag === TFOOT)
            ) {
                v = true;
                break;
            }
            else if (
                (tag === TABLE)
                ||
                (tag === HTML)
            ) {
                v = false;
                break;
            }
        };
        
        return v;
    }
);
