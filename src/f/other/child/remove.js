export default (
    function(node) {
        var
            i = 0,
            childNodes = this.childNodes
        ;
        return (
            (
                ((i = childNodes.indexOf(node)) === -1)
                ||
                (childNodes.splice(i, 1))
            ),
            undefined
        )
    }
)