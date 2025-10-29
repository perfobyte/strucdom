
import insert_before from '../before.js';
import {create_text_node} from '../../create/i.js'


export default (
    (parentNode, text, referenceNode) => {
        var
            childNodes = parentNode.childNodes,
            prevNode = (
                childNodes[
                    childNodes.indexOf(referenceNode) - 1
                ]
            )
        ;
        return (
            (
                prevNode
                &&
                ((prevNode).nodeName === '#text')
            )
            ? (
                prevNode.value += text
            )
            : (
                insert_before(
                    parentNode,
                    create_text_node(text),
                    referenceNode
                )
            )
        );
    }
);
