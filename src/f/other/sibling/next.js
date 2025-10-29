
export default (
    function() {
        var
            parentNode = null,
            childNodes = null,
            i = 0
        ;
        return (
            (parentNode = this.parentNode)
            ? (

            (childNodes = parentNode.childNodes)
            ? (

            ((i = childNodes.indexOf(this)) === -1)
            ? (
                
            (((++i) >= 0) && (i < childNodes.length))
            ? childNodes.at(i)
            : null

            )
            : null

            )
            : null

            )
            : null
        );
    }
);
