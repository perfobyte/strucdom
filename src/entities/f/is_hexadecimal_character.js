import {CharCodes} from '../conf/i.js';

export default (
    (UPPER_A, UPPER_F, LOWER_A, LOWER_F) =>
    
    (code) => {
        return (
            ((code >= UPPER_A) && (code <= UPPER_F))
            ||
            ((code >= LOWER_A) && (code <= LOWER_F))
        );
    }
)(
    CharCodes.UPPER_A,
    CharCodes.UPPER_F,
    CharCodes.LOWER_A,
    CharCodes.LOWER_F,
);
