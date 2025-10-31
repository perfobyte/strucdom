
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
                        i = (
                            (
                                childs = (
                                    parent
                                    .children
                                )
                            )
                            .indexOf(this)
                            - 1
                        )
                    ) >= 0
                )
                ? childs[i]
                : null
            )
            : null
        );
    }
);
