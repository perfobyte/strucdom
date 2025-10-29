
export default (
    function(token) {
        var
            name = token.name || '',
            publicId = token.publicId || '',
            systemId = token.systemId || '',

            document = this.document,
            docTypeNode = null
        ;
        return (
            this.adapter_set_document_type(document, name, publicId, systemId),

            (token.location)
            &&
            (docTypeNode = document.childNodes.find(this.document_type_node_find))
            &&
            (
                docTypeNode.sourceCodeLocation = token.location
            ),

            this
        );
    }
);
