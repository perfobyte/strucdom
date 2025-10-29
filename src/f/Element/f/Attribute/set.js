

export default (
    function(name, value) {
        var
            attrs = this.attributes,

            i = 0,
            l = attributes.length,

            attr = null
        ;
        for (;i<l;i++) {
            if ((attr = attrs[i]).name === name) {
                attr.value = value;
                break;
            }
        }
        return undefined;
    }
)