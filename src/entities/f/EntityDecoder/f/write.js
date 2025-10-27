

export default (
    function(input, offset) {
        var
            eds = this.EntityDecoderState,
            s = this.state
        ;

        return (
            (s === eds.EntityStart)
            ? (
                (input.charCodeAt(offset) === this.CharCodes.NUM)
                ? (
                    (this.state = eds.NumericStart),
                    (this.consumed += 1),
                    this.state_numeric_start(input, offset + 1)
                )
                : (
                    (this.state = eds.NamedEntity),
                    this.state_named_entity(input, offset)
                )
            )
            :
            (s === eds.NumericStart)
            ? this.state_numeric_start(input, offset)
            :
            (s === eds.NumericDecimal)
            ? this.state_numeric_decimal(input, offset)
            :
            (s === eds.NumericHex)
            ? this.state_numeric_hex(input, offset)
            :
            (s === eds.NamedEntity)
            ? this.state_named_entity(input, offset)
            : -1
        );
    }
)