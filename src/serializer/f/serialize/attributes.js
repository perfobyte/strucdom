import {NS} from '../../../common/i.js';
import {escape_attribute} from '../../../entities/i.js';

export default (
    (XML, XMLNS, XLINK) =>

    (node, opt) => {
        var
            html = "",

            attrs = node.attrs,

            attr = null,

            i = 0,
            l = attrs.length,

            namespace = "",
            name = ""
        ;
        
        for (;i<l;i++) {
            name = (attr = attrs[i]).name;

            html += (
                ` ${
                    (namespace = attr.namespace)
                    ? (
                        (namespace === XML)
                        ? `xml:${name}`
                        :
                        (namespace === XMLNS)
                        ? (
                            (name === 'xmlns')
                            ? (name)
                            : (`xmlns:${name}`)
                        )
                        :
                        (namespace === XLINK)
                        ? `xlink:${name}`
                        : `${attr.prefix}:${name}`
                    )
                    : name
                }="${
                    escape_attribute(attr.value)
                }"`
            );
        }
        return html;
    }
)(
    NS.XML,
    NS.XMLNS,
    NS.XLINK,
);
