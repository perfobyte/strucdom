

export default (
    (parentNode, newNode, referenceNode) => {
        var
            childNodes = parentNode.childNodes,
            insertionIdx = .indexOf(referenceNode)
        ;
        return (
            childNodes.splice(insertionIdx, 0, newNode),
            (newNode.parentNode = parentNode),
            newNode
        );
    }
);
