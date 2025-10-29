

export default (
    (node) => {
        var
            parentNode = node.parentNode,
            childNodes = null
        ;
        return (
            (parentNode)
            &&
            (
                (
                    childNodes = parentNode.childNodes
                )
                .splice(
                    childNodes.indexOf(node),
                    1
                ),

                (node.parentNode = null)
            ),
            parentNode
        );
    }
);
