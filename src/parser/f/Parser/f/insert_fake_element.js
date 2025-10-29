

export default (
    function(tagName, tagID) {
        var
            element = this.create_element(tagName, this.NS.HTML, [])
        ;
        return (
            this.attach_element_to_tree(element, null),
            this.openElements.push(element, tagID),
        );
    }
);
