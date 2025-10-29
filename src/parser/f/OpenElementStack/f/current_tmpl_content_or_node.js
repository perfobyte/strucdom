

export default (
    function() {
        var
            c = this.current
        ;
        return (
            this.is_in_template()
            ? (
                c.content
            )
            : (
                c
            )
        );
    }
)