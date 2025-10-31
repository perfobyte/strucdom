export default (
    function() {
        var
            childs = this.children
        ;
        return (
            childs[childs.length - 1] || null
        );
    }
);
