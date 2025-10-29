
export default (
    function(node, tid, isTop) {
        return (
            this.on_push?.(node),

            (isTop && (this.openElements.stackTop > 0))
            &&
            this.set_context_modes(node, tid),

            this
        );
    }
);
