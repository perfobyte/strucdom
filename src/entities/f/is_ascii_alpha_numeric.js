import is_number from './is_number.js';
import {CharCodes} from '../conf/i.js';

export default (
    (UPPER_A, UPPER_Z, LOWER_A, LOWER_Z, is_number) =>
    
    (code) => {
        return (
            ((code >= UPPER_A) && (code <= UPPER_Z))
            ||
            ((code >= LOWER_A) && (code <= LOWER_Z))
            ||
            is_number(code)
        );
    }
)(
    CharCodes.UPPER_A,
    CharCodes.UPPER_Z,
    CharCodes.LOWER_A,
    CharCodes.LOWER_Z,
    is_number,
);
