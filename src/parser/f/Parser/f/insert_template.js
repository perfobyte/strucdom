

export default (
    function(token) {
        var
            tmpl = this.create_element(token.tagName, this.NS.HTML, token.attrs),
            content = this.create_document_fragment()
        ;
        return (
            (tmpl.content = content),

            this.attach_element_to_tree(tmpl, token.location),
            this.openElements.push(tmpl, token.tagID),

            (this.options.sourceCodeLocationInfo)
            &&
            (content.sourceCodeLocation = null),
            
            this
        );
    }
);
