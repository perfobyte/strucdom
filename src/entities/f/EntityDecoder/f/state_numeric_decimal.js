

export default (
    (input, offset) => {
        var
            l = input.length,
            char = 0,
            CharCodes = this.CharCodes,
            v = -1,
            is_number = this.is_number
        ;
        a: while (offset < l) {
            if (is_number(char = input.charCodeAt(offset))) {
                this.result = (this.result * 10 + (char - CharCodes.ZERO));
                this.consumed++;
                offset++;
            }
            else {
                v = this.emitNumericEntity(char, 2);
                break a;
            }
        }
        return v;
    }
);
