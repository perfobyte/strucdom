

export default (
    (parentNode, newNode) => {
        return (
            parentNode.childNodes.push(newNode),
            (newNode.parentNode = parentNode),
            newNode
        );
    }
);
