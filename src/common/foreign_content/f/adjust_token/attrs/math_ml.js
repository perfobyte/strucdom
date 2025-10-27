import {DEFINITION_URL_ATTR, ADJUSTED_DEFINITION_URL_ATTR} from '../../../conf/i.js';


export default (
    (token) => {
        var
            i = 0,
            attrs = token.attrs,
            l = attrs.length,
            attr = null
        ;
        for (; i < l; i++) {
            if ((attr = attrs[i]).name === DEFINITION_URL_ATTR) {
                attr.name = ADJUSTED_DEFINITION_URL_ATTR;
                break;
            }
        };
        return undefined;
    }
);
