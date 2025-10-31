


export default (
    function(name) {
        
        var
            childs = this.children,
            Node = this.constructor,

            ATTRIBUTE_NODE = this.ATTRIBUTE_NODE,

            i = 0,
            l = childs.length,
            v = null,

            node = null
        ;
        for (;i<l;i++) {
            if (
                ((node=childs[i]).type === ATTRIBUTE_NODE)
                &&
                (node.name === name)
            ) {
                v = node.data;
                break;
            }
        };
        return v;
    }
);
