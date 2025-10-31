
export default (
    function(node) {
        var
            parent = null,
            childs = null,
            i = 0,

            prev_parent = node.parent
        ;
        return (
            (prev_parent)
            &&
            (prev_parent.remove_child(node)),

            (parent = this.parent)
            ? (
                (this.parent = null),
                (node.parent = parent),
                (
                    (
                        childs =
                            parent
                            .children
                    )[
                        childs
                        .indexOf(this)
                    ] = node
                )
            )
            : null
        );
    }
);
