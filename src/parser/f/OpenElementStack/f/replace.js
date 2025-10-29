

export default (
    function(oldElement, newElement) {
        var
            idx = this.index_of(oldElement)
        ;
        return (
            (
                this.items[idx] = (
                    (idx === this.stackTop)
                    ? (
                        this.current = newElement
                    )
                    : newElement
                )
            ),
            this
        );
    }
);
