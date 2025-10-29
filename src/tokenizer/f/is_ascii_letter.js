import is_ascii_upper from './is_ascii_upper.js';
import is_ascii_lower from './is_ascii_lower.js';

export default (
    (cp) => {
        return (
            is_ascii_lower(cp)
            ||
            is_ascii_upper(cp)
        );
    }
);
