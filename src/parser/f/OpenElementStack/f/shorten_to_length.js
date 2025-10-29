

export default (
    function(idx) {
        var
            stackTop = this.stackTop,
            popped = null
        ;
        while (this.stackTop >= idx) {
            popped = this.current;
            if ((this.tmplCount > 0) && this.is_in_template()) {
                this.tmplCount--;
            }
            this.stackTop--;
            this.update_current_element();
            this.handler.onItemPop(popped, (this.stackTop < idx));
        };
        return this;
    }
);
