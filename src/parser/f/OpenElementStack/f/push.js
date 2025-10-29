

export default (
    function(element, tagID) {
        var
            stackTop = (++this.stackTop)
        ;
        return (
            (
                this.items[stackTop] =
                this.current =
                    element
            ),

            (
                this.tagIDs[stackTop] =
                this.currentTagId =
                    tagID
            ),

            (
                this.is_in_template()
                &&
                (this.tmplCount++)
            ),

            this.handler.onItemPush(element, tagID, true)
        );
    }
)