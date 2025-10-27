export default (
    (token, attrName) => {
        var
            attrs = token.attrs,
            i = attrs.length - 1,
            attr = null,
            v = null
        ;
        for (; i >= 0; i--) {
            if ((attr = attrs[i]).name === attrName) {
                v = attr.value;
                break;
            }
        }
        return v;
    }
);
