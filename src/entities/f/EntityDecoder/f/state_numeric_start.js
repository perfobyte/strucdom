

export default (
    function(input, offset) {
        var
            eds = this.EntityDecoderState
        ;
        return (
            (offset >= input.length)
            ? -1
            :
            ((input.charCodeAt(offset) | this.TO_LOWER_BIT) === this.CharCodes.LOWER_X)
            ? (
                (this.state = eds.NumericHex),
                (this.consumed += 1),
                this.state_numeric_hex(input, offset + 1)
            )
            : (
                (this.state = eds.NumericDecimal),
                this.state_numeric_decimal(input, offset)
            )
        );
    }
);
