

export default (
    function() {
        var i = this.openElements.currentTagId
        return (
            (this.fosterParentingEnabled)
            &&
            (i !== undefined)
            &&
            this.is_element_causes_foster_parenting(i)
        );
    }
)