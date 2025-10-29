

export default (
    function(token, namespaceURI) {
        var
            element = this.create_element(token.tagName, namespaceURI, token.attrs)
        ;
        return (
            this.attach_element_to_tree(element, token.location),
            this.openElements.push(element, token.tagID),
            this
        );
    }
)