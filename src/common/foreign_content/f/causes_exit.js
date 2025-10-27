import {ATTRS, TAG_ID as _} from '../../html/i.js';
import {EXITS_FOREIGN_CONTENT} from '../map/i.js';


export default (
    (s,FONT) => (startTagToken) => {
        var
            tn = startTagToken.tagID
        ;
        return (
            (
                (tn === FONT)
                &&
                startTagToken.attrs.some(s)
            )
            ||
            EXITS_FOREIGN_CONTENT.has(tn)
        );
    }
)(
    ((COLOR, SIZE, FACE) => (a) => {
        var
            n = a.name
        ;
        return (
            (n === COLOR)
            ||
            (n === SIZE)
            ||
            (n === FACE)
        )
    })(ATTRS.COLOR, ATTRS.SIZE, ATTRS.FACE),
    _.FONT
);