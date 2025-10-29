export default (
    function() {
        var
            i = this.stackTop,
            tagIDs = this.tagIDs,
            items = this.items,

            NS = this.NS,

            HTML = NS.HTML,
            SVG = NS.SVG,
            MATHML = NS.MATHML,

            NUMBERED_HEADERS = this.NUMBERED_HEADERS,
            SCOPING_ELEMENTS_HTML = this.SCOPING_ELEMENTS_HTML,
            SCOPING_ELEMENTS_SVG = this.SCOPING_ELEMENTS_SVG,
            SCOPING_ELEMENTS_MATHML = this.SCOPING_ELEMENTS_MATHML,

            v = true,
            tn = 0,
            n = ""
        ;

        for (; i >= 0; i--) {

            if ((n = (items[i]).namespaceURI) === HTML) {
                (NUMBERED_HEADERS.has(tn = tagIDs[i]))
                &&
                (v = true);

                (SCOPING_ELEMENTS_HTML.has(tn))
                &&
                (v = false);

                break;
            }
            else if (n === SVG) {
                (SCOPING_ELEMENTS_SVG.has(tn = tagIDs[i]))
                &&
                (v = false);

                break;
            }
            else if (n === MATHML) {
                (SCOPING_ELEMENTS_MATHML.has(tn = tagIDs[i]))
                &&
                (v = false);

                break;
            };
        }
        return v;
    }
)
