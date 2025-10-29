

export default (
    function() {
        var
            popped = this.current
        ;
        return (
            ((this.tmplCount > 0) && this.is_in_template())
            &&
            (this.tmplCount--),

            (this.stackTop--),
            this.update_current_element(),
            this.handler.onItemPop(popped, true)
        );
    }
);
