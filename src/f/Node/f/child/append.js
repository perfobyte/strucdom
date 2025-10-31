
export default (
    function(node) {
        var
            prev_parent = node.parent
        ;
        return (
            (prev_parent)
            &&
            (prev_parent.remove_child(node)),

            (
                node.parent = this
            )
            .children
            .push(
                node
            ),

            node
        );
    }
);
