
export default (
    function(element, token) {
        return (
            this.entries.splice(
                this.entries.indexOf(this.bookmark),
                0,
                {
                    type: this.EntryType.Element,
                    element,
                    token,
                }
            )
        );
    }
);
