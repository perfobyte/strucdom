import {NS, TAG_ID as _, ATTRS} from '../../../../html/i.js'
import {MIME_TYPES} from '../../../conf/i.js';


export default (
    (
        MATHML,
        ANNOTATION_XML,
        ENCODING,

        TEXT_HTML,
        APPLICATION_XML,
        
        SVG,
        FOREIGN_OBJECT,
        DESC,
        TITLE,
    ) =>

    (tn, ns, attrs) => {
        var
            i = 0,
            l = 0,
            attr = null,
            v = false,
            value = ""
        ;
        
        if (ns === MATHML && tn === ANNOTATION_XML) {
            l = attrs.length;
            for (; i < l; i++) {
                if ((attr = attrs[i]).name === ENCODING) {
                    v = (
                        (
                            (
                                value =
                                    attr
                                    .value
                                    .toLowerCase()
                            ) === TEXT_HTML
                        )
                        ||
                        (value === APPLICATION_XML)
                    );
                    break;
                }
            }
        }
        else {
            v = (
                (ns === SVG)
                &&
                (
                    (tn === FOREIGN_OBJECT)
                    ||
                    (tn === DESC)
                    ||
                    (tn === TITLE)
                )
            );
        }
        return v;
    }
)(
    NS.MATHML,
    _.ANNOTATION_XML,
    ATTRS.ENCODING,

    MIME_TYPES.TEXT_HTML,
    MIME_TYPES.APPLICATION_XML,

    NS.SVG,
    _.FOREIGN_OBJECT,
    _.DESC,
    _.TITLE,
);
