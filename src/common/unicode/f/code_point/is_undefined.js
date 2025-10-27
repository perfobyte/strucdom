import {UNDEFINED_CODE_POINTS} from '../../conf/i.js';

export default (
    (cp) => {
        return (((cp >= 64976) && (cp <= 65007)) || UNDEFINED_CODE_POINTS.has(cp));
    }
);
