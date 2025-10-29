

export default (
    function(token, namespaceURI) {
        return (
            this.attach_element_to_tree(
                this.create_element(
                    token.tagName,
                    namespaceURI,
                    token.attrs
                ),
                token.location
            )
        );
    }
);
