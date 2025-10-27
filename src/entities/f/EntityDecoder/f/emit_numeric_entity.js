

export default (
    (lastCp, expectedLength) => {
        var
            SEMI = this.CharCodes.SEMI,

            lastCpIsSemi = false
        ;
        return (
            (this.consumed <= expectedLength)
            ? (
                this.errors?.absenceOfDigitsInNumericCharacterReference(this.consumed),
                0
            )
            : (
                (
                    (lastCpIsSemi = lastCp === SEMI)
                    ? (
                        (this.consumed += 1),
                        true
                    )
                    : (
                        this.decodeMode === this.DecodingMode.Strict
                    )
                )
                ? 0
                : (
                    this.emit_code_point(this.replace_code_point(this.result), this.consumed),

                    this.errors
                    &&
                    (
                        (lastCp === SEMI)
                        ||
                        (this.errors?.missingSemicolonAfterCharacterReference()),

                        this.errors?.validateNumericCharacterReference(this.result)
                    ),

                    this.consumed
                )
            )
        );
    }
);
