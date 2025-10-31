
export default (
    function(value) {
        return (
            new (
                this.constructor
            )(
                this.COMMENT_NODE,
                "#comment",
                
                null,
                null,
                null,
                
                value,
                true,
            )
        );
    }
);
