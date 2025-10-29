

export default (
    function(tagNames, targetNS) {
        return (
            this.shorten_to_length(
                (
                    this.index_of_tag_names(tagNames, targetNS)
                )
                + 1
            )
        );
    }
)