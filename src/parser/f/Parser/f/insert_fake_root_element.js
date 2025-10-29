

export default (
    function() {
        var
            element = this.create_element(this.TAG_NAMES.HTML, this.NS.HTML, []),

            openElements = this.openElements
        ;
        return (
            (this.options.sourceCodeLocationInfo)
            &&
            (element.sourceCodeLocation = null),

            this.append_child(openElements.current, element),
            openElements.push(element, this.TAG_ID.HTML),

            this
        )
        
        
    }
);
