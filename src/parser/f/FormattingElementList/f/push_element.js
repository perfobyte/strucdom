

export default (
    function(element, token) {
        return (
            this.ensure_noah_ark_condition(element),
            this.entries.unshift({
                type: this.EntryType.Element,
                element,
                token,
            })
        );
    }
);
