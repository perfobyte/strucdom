import {
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,            
} from '../../../../../conf/NodeType.js';

import df from './default.js';
import data from './data.js';

export default {
    [ELEMENT_NODE]: df,
    [ATTRIBUTE_NODE]: data,
    [TEXT_NODE]: data,
    [COMMENT_NODE]: data,
};
