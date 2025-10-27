import {CharCodes} from '../conf/i.js';
import is_ascii_alpha_numeric from './is_ascii_alpha_numeric.js';


export default (
    (EQUALS, is_ascii_alpha_numeric) =>
    
    (code) => {
        return ((code === EQUALS) || is_ascii_alpha_numeric(code));
    }
)(CharCodes.EQUALS, is_ascii_alpha_numeric);