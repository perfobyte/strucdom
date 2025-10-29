

export default (
    function(element, id) {
        return (
            this
            .SPECIAL_ELEMENTS[
                element.namespaceURI
            ]
            .has(id)
        );
    }
)