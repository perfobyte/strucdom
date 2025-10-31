import {DOCUMENT_NODE} from '../../../../conf/i.js';
import Node from '../../i.js';

export default (
    function(name, children) {
        var Node = this.constructor;
        return (
            new Node(
                this.ELEMENT_NODE,
                name,

                children,
                null,
                null,

                "",
                true,
            )
        );
    }
);
