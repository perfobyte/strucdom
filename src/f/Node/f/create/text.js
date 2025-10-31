
export default (
    function(value) {
        return (
            new (
                this.constructor
            )(
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
