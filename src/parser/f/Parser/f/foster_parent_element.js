

export default (
    function(element) {
        var
            location = this.find_foster_parenting_location(),
            parent = location.parent
        ;
        return (
            (location.beforeElement)
            ? this.insert_before(parent, element, location.beforeElement)
            : this.append_child(parent, element),

            element
        );
    }
)