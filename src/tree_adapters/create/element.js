export default (
    (tagName, namespaceURI, attrs) => {
        return {
            nodeName: tagName,
            tagName,
            attrs,
            namespaceURI,
            childNodes: [],
            parentNode: null,
        };
    }
)