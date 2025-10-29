import {TAG_NAMES as _, NS} from '../../../common/i.js';
import serialize_node from './node/_.js';

export default (
    (TEMPLATE, HTML) =>

    (parentNode, options) => {
        var
            html = '',
            ta = options.treeAdapter,

            container = (
                (parentNode).hasOwnProperty("tagName")
                &&
                ((parentNode).tagName === TEMPLATE)
                &&
                (
                    ((parentNode).namespaceURI === HTML)
                    ? parentNode.content
                    : parentNode
                )
            ),
            childNodes = (container).childNodes,

            i = 0,
            l = 0
        ;
        
        if (
            childNodes
            &&
            ((l = childNodes.length) > 0)
        ) {
            for (;i<l;i++) {
                html += serialize_node(childNodes[i], options);
            }
        }
        return html;
    }
)(
    _.TEMPLATE,
    NS.HTML
);
