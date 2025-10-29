

export default (
    (attr_name) => (recipient, attrs) => {
        var
            r_attrs = recipient.attrs,
            recipientAttrsMap = new Set(r_attrs.map(attr_name)),

            j = 0,
            l = attrs.length
        ;
        for (; j < l; j++) {
            (
                recipientAttrsMap.has((attr = attrs[j]).name)
            )
            ||
            (
                r_attrs.push(attr)
            );
        };
        return recipient;
    }
)(
    ((a) => (a.name)),
);
