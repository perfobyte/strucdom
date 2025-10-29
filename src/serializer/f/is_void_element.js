import {VOID_ELEMENTS} from '../conf/i.js';
import {NS} from '../../common/i.js';


export default (
    (HTML) =>
    
    (node) => {
        return (
            node.hasOwnProperty("tagName")
            &&
            (node.namespaceURI === HTML)
            &&
            VOID_ELEMENTS.has(node.tagName)
        );
    }
)(
    NS.HTML,
);
