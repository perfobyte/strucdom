


export default (
    function(name) {
        
        var
            childs = this.children,
            
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
                this.remove_child(node);
                break;
            }
        };
        return undefined;
    }
);
