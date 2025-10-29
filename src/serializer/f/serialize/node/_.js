import serialize_element from '../element.js';
import serialize_text_node from './text.js';
import serialize_comment_node from './comment.js';
import serialize_document_type_node from './document_type.js';
import empty_str from '../../empty_str.js';

export default (
    (node, options) => {
        var
            nodeName = ""
        ;
        return (
            (
                node.hasOwnProperty("tagName")
                ? serialize_element
                :
                ((nodeName = node.nodeName) === '#text')
                ? serialize_text_node
                :
                (nodeName === '#comment')
                ? serialize_comment_node
                :
                (nodeName === '#documentType')
                ? serialize_document_type_node
                : empty_str
            )(
                node,
                options
            )
        );
    }
);

