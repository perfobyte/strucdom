export default (
    function(node) {
        var
            i = 0,
            childs = this.children
        ;
        return (
            (node.parent = null),
            (
                ((i = childs.indexOf(node)) === -1)
                ||
                (childs.splice(i, 1))
            ),
            undefined
        )
    }
)