import is_void_element from '../is_void_element.js';
import serialize_child_nodes from './child_nodes.js';

export default (
    (node, options) => {
        return (
            is_void_element(node)
            ? ""
            : serialize_child_nodes(node, options)
        );
    }
);
