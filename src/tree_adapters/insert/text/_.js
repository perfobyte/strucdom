import append_child from "../../append_child.js";
import create_text_node from '../../create/node/text.js';

export default (
    (parentNode, text) => {
        var
            childNodes = parentNode.childNodes,
            l = childNodes.length,
            prevNode = null
        ;
        return (
            (
                (l > 0)
                &&
                (
                    (
                        prevNode = (
                            childNodes[l - 1]
                        )
                    )
                    .nodeName === '#text'
                )
            )
            ? (
                prevNode.value += text
            )
            : (
                append_child(parentNode, create_text_node(text)),
                text
            )
        );
    }
);
