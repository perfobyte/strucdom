import {DOCUMENT_NODE} from '../../../../conf/i.js';
import Node from '../../i.js';

export default (
    function(name, children) {
        return (
            new (
                this.constructor
            )(
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
