export default (
    function (nodes) {
        var
            parent = this.parent,
            l = 0,
            idx = 0,
            i = 0,
            children = null,
            np = null,
            node = null,
            ps = null,
            pidx = 0
        ;
        
        if (
            parent
            &&
            (
                (
                    idx =
                        (
                            children = parent.children
                        )
                        .indexOf(this)
                ) > -1
            )
            &&
            (l = nodes.length)
        ) {
            this.parent = null;
            

            for (; i < l; i++) {
                node = nodes[i];

                
                if (
                    (node !== this)
                    &&
                    (np = node.parent)
                    &&
                    (
                        (
                            pidx = (
                                (ps = np.children)
                                .indexOf(node)
                            )
                        ) !== -1
                    )
                ) {
                    ((np === parent) && (pidx < idx)) && (idx--);
                    ps.splice(pidx, 1);
                }
                
            }

            children.splice(idx, 1, ...nodes);
            i = 0;
            l = nodes.length;
            for (; i < l; i++) {
                nodes[i].parent = parent;
            };
        };
        return undefined;
    }
);