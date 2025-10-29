

export default (
    function(name) {
        var
            attrs = this.attributes,

            i = 0,
            l = attributes.length,

            attr = null,

            v = null
        ;
        for (;i<l;i++) {
            if ((attr = attrs[i]).name === name) {
                v = attr.value;
                break;
            }
        }
        return v;
    }
)