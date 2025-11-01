export default (
    function(unclosed) {
        var
            childs = this.children,

            ATTRIBUTE_NODE = this.ATTRIBUTE_NODE,

            this_name = this.name,

            v = `<${this_name}`,
            inside = "",
            
            i = 0,
            l = childs.length,

            node = null,

            name = "",
            data = "",
            
            nodeType = 0
        ;
        for (;i<l;i++) {
            if ((nodeType = (node = childs[i]).type) === ATTRIBUTE_NODE) {
                v += (
                    ` ${node.outer_html(unclosed)}`
                );
            }
        }
        return (
            (inside = this.inner_html(unclosed))
            ? `${v}>${inside}</${this_name}>`
            : (
                unclosed.includes(this_name.toLowerCase())
                ? `${v}>`
                : `${v}></${this_name}>`
            )
        );
    }
);
