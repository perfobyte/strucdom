
export default (
    function(tagName) {
        return this.has_in_dynamic_scope(tagName, this.SCOPING_ELEMENTS_HTML_BUTTON);
    }
);
