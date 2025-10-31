export default (
    function(unclosed) {
        var
            childs = this.children,
            ATTRIBUTE_NODE = this.ATTRIBUTE_NODE,

            inside = "",

            i = 0,
            l = childs.length,
            node = null,
            nodeType = 0
        ;
        for (;i<l;i++) {
            if ((nodeType = (node = childs[i]).type) !== ATTRIBUTE_NODE) {
                inside += node.outer_html(unclosed);
            }
        }
        return inside;
    }
);
