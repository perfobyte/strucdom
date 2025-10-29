import {create_element} from '../../../tree_adapters/i.js';

export default (
    (p, elementEntry) => {
        var
            token = elementEntry.token,
            element = elementEntry.element,

            newElement = create_element(token.tagName, (element.namespaceURI), token.attrs)
        ;
        return (
            p.openElements.replace(element, newElement),
            (elementEntry.element = newElement),
            newElement
        );
    }
);
