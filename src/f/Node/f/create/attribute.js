
export default (
    function(key, value) {
        return (
            new (
                this.constructor
            )(
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
