
export default (
    function(entry) {
        var
            entryIndex = this.entries.indexOf(entry)
        ;
        return (
            (entryIndex === -1)
            ||
            (
                this.entries.splice(entryIndex, 1)
            ),

            this
        );
    }
);
