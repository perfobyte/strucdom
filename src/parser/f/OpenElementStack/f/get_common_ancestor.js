export default (
    function(element) {
        var
            elementIdx = (
                this.index_of(element) - 1
            )
        ;
        return (
            (elementIdx >= 0)
            ? this.items[elementIdx]
            : null
        );
    }
)