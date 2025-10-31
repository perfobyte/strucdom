
export default (
    function(value) {
        var Node = this.constructor;
        return (
            new Node(
                this.TEXT_NODE,
                "#text",

                null,
                null,
                null,

                value,
                true,
            )
        );
    }
);
