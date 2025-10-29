export default (
    function(tagName, htmlScope) {
        var
            i = this.stackTop,
            tn = "",
            item = null,
            u = "",

            NS = this.NS,
            SCOPING_ELEMENTS_SVG = this.SCOPING_ELEMENTS_SVG,
            SCOPING_ELEMENTS_MATHML = this.SCOPING_ELEMENTS_MATHML,
            tagIDs = this.tagIDs,
            items = this.items,

            HTML = NS.HTML,
            SVG = NS.SVG,
            MATHML = NS.MATHML,

            v = true
        ;
        for (; i >= 0; i--) {
            if ((u = (item = items[i]).namespaceURI) === HTML) {
                ((tn = tagIDs[i]) === tagName)
                && (v = true);
                
                (htmlScope.has(tn))
                &&
                (v = false);
                    
                break;
            }
            else if (u === SVG) {
                SCOPING_ELEMENTS_SVG.has(tn = tagIDs[i])
                &&
                (v = false);

                break;
            }
            else if (u === MATHML) {
                SCOPING_ELEMENTS_MATHML.has(tn = tagIDs[i])
                &&
                (v = false);
                
                break;
            }
        }
        return v;
    }
);
