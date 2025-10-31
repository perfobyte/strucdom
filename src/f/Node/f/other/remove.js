export default (
    function() {
        var
            parent = this.parent
        ;
        return (
            parent && parent.remove_child(this),
            undefined
        );
    }
);
