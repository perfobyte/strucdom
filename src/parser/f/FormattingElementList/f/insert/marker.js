export default (
    function() {
        return this.entries.unshift(this.MARKER);
    }
);
