export default (
    function(unclosed) {
        var
            childs = this.children,

            TEXT_NODE = this.TEXT_NODE,
            ELEMENT_NODE = this.ELEMENT_NODE,

            inside = "",

            i = 0,
            l = childs.length,

            node = null,
            nodeType = 0
        ;
        for (;i<l;i++) {
            if ((nodeType = (node = childs[i]).type) === TEXT_NODE) {
                inside += node.outer_html(unclosed);
            }
            else if (nodeType === ELEMENT_NODE) {
                inside += node.text_content(unclosed);
            }
        }
        return inside;
    }
);
