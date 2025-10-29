export default (
    function() {
        var
            childNodes = this.childNodes
        ;
        return (
            childNodes.at(childNodes.length - 1)
        );
    }
);
