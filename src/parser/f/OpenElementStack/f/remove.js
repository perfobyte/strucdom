

export default (
    function(element) {
        var
            idx = this.index_of(element)
        ;
        return (
            (idx >= 0)
            &&
            (
                (idx === this.stackTop)
                ? this.pop()
                : (
                    this.items.splice(idx, 1),
                    this.tagIDs.splice(idx, 1),
                    (this.stackTop--),
                    this.update_current_element(),
                    this.handler.onItemPop(element, false)
                )
            ),
            
            this
        );
    }
);
