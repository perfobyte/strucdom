export default (
    function() {
        var
            s = this.state,
            e = this.EntityDecoderState,
            result = this.result
        ;
        return (
            (s === e.NamedEntity)
            ? (
                (result !== 0)
                &&
                (
                    (this.decodeMode !== this.DecodingMode.Attribute)
                    ||
                    (result === this.treeIndex)
                )
                ? this.emit_not_terminated_named_entity()
                : 0
            )
            :
            (s === e.NumericDecimal)
            ? this.emit_numeric_entity(0, 2)
            :
            (s === e.NumericHex)
            ? this.emit_numeric_entity(0, 3)
            :
            (s === e.NumericStart)
            ? (
                this.errors?.absenceOfDigitsInNumericCharacterReference(this.consumed),
                0
            )
            :
            (s === e.EntityStart)
            ? 0
            : -1
        );
    }
);
