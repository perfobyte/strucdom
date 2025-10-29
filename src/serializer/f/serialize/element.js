import serialize_attributes from './attributes.js';
import is_void_element from '../is_void_element.js';
import serialize_child_nodes from './child_nodes.js';

export default (
    (node, options) => {
        var
            tn = (node.tagName)
        ;
        return (
            `<${
                tn
            }${
                serialize_attributes(node, options)
            }>${
                is_void_element(node, options)
                ? ''
                : (
                    `${
                        serialize_child_nodes(
                            node,
                            options
                        )
                    }</${
                        tn
                    }>`
                )
            }`
        );
    }
);
