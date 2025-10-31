import {DOCUMENT_NODE} from '../../../../conf/i.js';
import Node from '../../i.js';

export default (
    (children) => {
        return (
            new Node(
                DOCUMENT_NODE,
                "#document",

                children,
                null,
                null,

                "",
                true,
            )
        );
    }
);
