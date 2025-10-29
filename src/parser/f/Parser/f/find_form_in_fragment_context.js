

export default (
    function() {
        var
            node = this.fragmentContext,
            FORM = this.TAG_NAMES.FORM
        ;
        while (node) {
            if ((node.tagName) === FORM) {
                this.formElement = node;
                break;
            };
            node = (node.parentNode);
        };
        return node;
    }
);
