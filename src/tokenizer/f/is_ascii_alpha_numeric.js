import is_ascii_digit from './is_ascii_digit.js';
import is_ascii_letter from './is_ascii_letter.js';

export default (
    (cp) => {
        return (is_ascii_letter(cp) || is_ascii_digit(cp));
    }
);
