
export default (
    function(key, value) {
        var Node = this.constructor;
        return (
            new Node(
                this.ATTRIBUTE_NODE,
                key,

                null,
                null,
                null,
                
                value,
                true,
            )
        );
    }
);
