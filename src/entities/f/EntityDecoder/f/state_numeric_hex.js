export default (
    function(input, offset) {
        var
            l = input.length,
            char = 0,
            digit = 0,
            CharCodes = this.CharCodes,
            TO_LOWER_BIT = this.TO_LOWER_BIT,
            v = -1
        ;
        a: while (offset < l) {
            
            if (
                this.is_number(char = input.charCodeAt(offset))
                ||
                this.is_hexadecimal_character(char)
            ) {
                this.result = this.result * 16 + (
                    (char <= CharCodes.NINE)
                    ? (char - CharCodes.ZERO)
                    : (
                        (char | TO_LOWER_BIT)
                        - CharCodes.LOWER_A
                        + 10
                    )
                );
                this.consumed++;
                offset++;
            }
            else {
                v = this.emit_numeric_entity(char, 3);
                break a;
            }
        }
        return v;
    }
);
