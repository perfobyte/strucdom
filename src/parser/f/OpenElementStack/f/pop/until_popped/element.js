
export default (
    function(element) {
        return this.shorten_to_length(Math.max(this.index_of(element), 0));
    }
);
