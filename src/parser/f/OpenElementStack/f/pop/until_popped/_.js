

export default (
    function(
        tagNames,
        targetNS
    ) {
        return (
            this.shorten_to_length(
                Math.max(
                    this.index_of_tag_names(
                        tagNames,
                        targetNS
                    ),
                    0
                )
            )
        );
    }
)