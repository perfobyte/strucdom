export default (
    function() {
        var
            fragmentContext = this.fragmentContext,
            openElements = this.openElements
        ;
        return (
            ((openElements.stackTop === 0) && fragmentContext)
            ? fragmentContext
            : openElements.current
        );
    }
);
