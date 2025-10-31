


export default (
    function(name, value) {
        
        var
            childs = this.children,
            Node = this.constructor,

            ATTRIBUTE_NODE = this.ATTRIBUTE_NODE,

            i = 0,
            l = childs.length,

            node = null
        ;
        a: {
            for (;i<l;i++) {
                if (
                    ((node=childs[i]).type === ATTRIBUTE_NODE)
                    &&
                    (node.name === name)
                ) {
                    node.data = value;
                    node.specified ||= true;
                    break a;
                }
            };
            childs.push(new Node(
                ATTRIBUTE_NODE,
                name,
                
                null,
                this,
                this.ownerDocument,

                value,
                true,
            ));
        }
        return undefined;
    }
);
