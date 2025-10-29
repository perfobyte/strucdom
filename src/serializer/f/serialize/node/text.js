import {NS, has_unescaped_text} from '../../../../common/i.js';
import {escape_text} from '../../../../entities/i.js';


export default (
    (HTML) =>
    
    (node, options) => {
        var
            content = node.value,
            parent = node.parentNode,
            parentTn = (
                parent
                &&
                parent.hasOwnProperty("tagName")
                &&
                (parent.tagName)
            )
        ;

        return (
            parentTn
            &&
            ((parent.namespaceURI) === HTML)
            &&
            (
                has_unescaped_text(parentTn, options.scriptingEnabled)
                ? content
                : escape_text(content)
            )
        );
    }
)(
    NS.HTML,
);
