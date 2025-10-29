

export default (
    function(element) {
        return (
            (
                this.items
            )
            .lastIndexOf(
                element,
                this.stackTop
            )
        );
    }
);
