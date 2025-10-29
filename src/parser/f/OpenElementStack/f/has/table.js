export default (
    function(tagName) {
        var
            i = this.stackTop,
            tagIDs = this.tagIDs,
            items = this.items,

            TAG_ID = this.TAG_ID,

            TABLE = TAG_ID.TABLE,
            HTML = TAG_ID.HTML,

            NS_HTML = this.NS.HTML,

            tag = 0,
            v = true
        ;
        for (; i >= 0; i--) {
            if (((items[i]).namespaceURI) !== NS_HTML) {
                continue;
            }

            if ((tag = tagIDs[i]) === tagName) {
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
        }
        return v;
    }
)