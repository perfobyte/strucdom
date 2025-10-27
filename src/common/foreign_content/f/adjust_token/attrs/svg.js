import {SVG_ATTRS_ADJUSTMENT_MAP} from '../../../map/i.js';

export default (token) => {
    var
        i = 0,
        attrs = token.attrs,
        l = attrs.length,
        attr = null,
        name = ""
    ;
    for (; i < l; i++) {
        ((name = SVG_ATTRS_ADJUSTMENT_MAP.get((attr = attrs[i]).name)) === null)
        ||
        (
            attr.name = name;
        );
    };
    return undefined;
}