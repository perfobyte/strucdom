
export default (
    function() {
        var
            parent = null,
            childs = null,
            i = 0
        ;
        return (
            (parent = this.parent)
            ? (
                (
                    (
                        i =
                            (
                                childs =
                                    parent
                                    .children
                            )
                            .indexOf(this)
                            + 1
                    ) < childs.length
                )
                ? childs[i]
                : null
            )
            : null
        );
    }
);
