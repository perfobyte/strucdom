export {default as create_document} from "./create_document.js";


export var defaultTreeAdapter = {
    
    getParentNode(node) {
        return node.parentNode;
    },
    getAttrList(element) {
        return element.attrs;
    },
    getTagName(element) {
        return element.tagName;
    },
    getNamespaceURI(element) {
        return element.namespaceURI;
    },
    getTextNodeContent(textNode) {
        return textNode.value;
    },
    getCommentNodeContent(commentNode) {
        return commentNode.data;
    },
    getDocumentTypeNodeName(doctypeNode) {
        return doctypeNode.name;
    },
    getDocumentTypeNodePublicId(doctypeNode) {
        return doctypeNode.publicId;
    },
    getDocumentTypeNodeSystemId(doctypeNode) {
        return doctypeNode.systemId;
    },
    isTextNode(node) {
        return node.nodeName === '#text';
    },
    isCommentNode(node) {
        return node.nodeName === '#comment';
    },
    isDocumentTypeNode(node) {
        return node.nodeName === '#documentType';
    },
    isElementNode(node) {
        return node.hasOwnProperty("tagName");
    },
    setNodeSourceCodeLocation(node, location) {
        node.sourceCodeLocation = location;
    },
    getNodeSourceCodeLocation(node) {
        return node.sourceCodeLocation;
    },
    updateNodeSourceCodeLocation(node, endLocation) {
        node.sourceCodeLocation = { ...node.sourceCodeLocation, ...endLocation };
    },
};
