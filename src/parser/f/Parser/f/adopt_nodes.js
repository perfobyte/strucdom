export default (
    function(donor, recipient) {
        var
            child = (donor.childNodes[0])
        ;
        for (; child; child = (donor.childNodes[0])) {
            this.detach_node(child);
            this.append_child(recipient, child);
        };
        return this;
    }
)