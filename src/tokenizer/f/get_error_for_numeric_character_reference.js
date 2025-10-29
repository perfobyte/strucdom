import {
    ERR,
    CODE_POINTS as _,
    is_surrogate,
    is_undefined_code_point,
    is_control_code_point,
} from '../../common/i.js'

export default (
    (
        NULL,
        CARRIAGE_RETURN,

        nullCharacterReference,
        characterReferenceOutsideUnicodeRange,
        surrogateCharacterReference,
        noncharacterCharacterReference,
        controlCharacterReference,

    ) =>
    
    (code) => {
        return (
            (code === NULL)
            ? nullCharacterReference
            :
            (code > 1114111)
            ? characterReferenceOutsideUnicodeRange
            :
            is_surrogate(code)
            ? surrogateCharacterReference
            :
            is_undefined_code_point(code)
            ? noncharacterCharacterReference
            :
            (
                is_control_code_point(code)
                ||
                (code === CARRIAGE_RETURN)
            )
            ? controlCharacterReference
            : null
        );
    }
)(
    _.NULL,
    _.CARRIAGE_RETURN,

    ERR.nullCharacterReference,
    ERR.characterReferenceOutsideUnicodeRange,
    ERR.surrogateCharacterReference,
    ERR.noncharacterCharacterReference,
    ERR.controlCharacterReference,
);
