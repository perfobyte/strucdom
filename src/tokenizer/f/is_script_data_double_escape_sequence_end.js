import is_whitespace from './is_whitespace.js';
import {CODE_POINTS as _} from '../../common/i.js';

export default (
    (SOLIDUS, GREATER_THAN_SIGN) =>

    (cp) => {
        return (
            is_whitespace(cp)
            ||
            (cp === SOLIDUS)
            ||
            (cp === GREATER_THAN_SIGN)
        );
    }
)(
    _.SOLIDUS,
    _.GREATER_THAN_SIGN,
);
