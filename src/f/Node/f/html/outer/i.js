import {
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,
    DOCUMENT_NODE,
} from '../../../../../conf/NodeType.js';

import df from './default.js';
import data from '../inner/data.js';
import document from '../inner/document.js';

import comment from './comment.js';
import attribute from './attribute.js';

export default {
    [ELEMENT_NODE]: df,
    [ATTRIBUTE_NODE]: attribute,
    [TEXT_NODE]: data,
    [COMMENT_NODE]: comment,
    [DOCUMENT_NODE]: document,
};
