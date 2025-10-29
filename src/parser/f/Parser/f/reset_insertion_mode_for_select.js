export default (
    function(selectIdx) {
        var
            InsertionMode = this.InsertionMode,
            TAG_ID = this.TAG_ID,

            i = 0,
            tn = 0,
            tagIDs = this.openElements.tagIDs,

            TEMPLATE = TAG_ID.TEMPLATE,
            TABLE = TAG_ID.TABLE,

            IN_SELECT_IN_TABLE = InsertionMode.IN_SELECT_IN_TABLE
        ;

        r: {
            if (selectIdx > 0) {
                i = selectIdx - 1;
                b: for (; i > 0; i--) {
                    if ((tn = tagIDs[i]) === TEMPLATE) {
                        break b;
                    }
                    else if (tn === TABLE) {
                        this.insertionMode = IN_SELECT_IN_TABLE;
                        break r;
                    }
                }
            };
            this.insertionMode = InsertionMode.IN_SELECT;
        };

        return this;
    }
);
