

export default (
    function(tagName) {
        var
            i = this.stackTop,
            items = this.items,

            NS = this.NS,
            TAG_ID = this.TAG_ID,
            tagIDs = this.tagIDs,

            NS_HTML = NS.HTML,

            OPTION = TAG_ID.OPTION,
            OPTGROUP = TAG_ID.OPTGROUP,

            tag = 0,
            v = true
        ;

        for (; i >= 0; i--) {
            if (
                (((items[i]).namespaceURI) !== NS_HTML)
            ) {
                continue;
            }

            if (
                ((tag = tagIDs[i]) === tagName)
            ) {
                v = true;
                break;
            }
            else if (
                (tag === OPTION)
                ||
                (tag === OPTGROUP)
            ) {
                break;
            }
            else {
                v = false;
                break;
            }
        }
        return v;
    }
);

