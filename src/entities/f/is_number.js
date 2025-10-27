import {CharCodes} from '../conf/i.js';

export default (
    (ZERO, NINE) =>
    
    (code) => {
        return ((code >= ZERO) && (code <= NINE));
    }
)(
    CharCodes.ZERO,
    CharCodes.NINE,
);
