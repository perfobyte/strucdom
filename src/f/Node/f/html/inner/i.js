import {
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,
    DOCUMENT_NODE,
} from '../../../../../conf/NodeType.js';

import df from './default.js';
import data from './data.js';
import document from './document.js';

export default {
    [ELEMENT_NODE]: df,
    [ATTRIBUTE_NODE]: data,
    [TEXT_NODE]: data,
    [COMMENT_NODE]: data,
    [DOCUMENT_NODE]: document,
};
