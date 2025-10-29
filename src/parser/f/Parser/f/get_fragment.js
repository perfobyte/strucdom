export default (
    function() {
        var
            rootElement = (this.document.childNodes[0]),
            fragment = this.create_document_fragment()
        ;
        return (
            this.adopt_nodes(rootElement, fragment),
            fragment
        );
    }
);
