
export default (
    function(node) {
        return (
            this
            .childNodes
            .push(node)
        )
    }
)
