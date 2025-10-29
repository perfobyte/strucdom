
function Attr(
    name,
    value,
    ownerElement,
    specified,
) {
    this.name = name;
    this.value = value;
    
    this.ownerElement = ownerElement;
    this.specified = specified;
};

Attr.prototype = {
    nodeType: 2,
    get nodeName() {
        return this.name;
    }
    get nodeValue() {
        return this.value;
    }
};

export default Attr;