
export default (
    function(value) {
        var Node = this.constructor;
        return (
            new Node(
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
