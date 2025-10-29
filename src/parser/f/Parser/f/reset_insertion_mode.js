

export default (
    function() {

        var
            openElements = this.openElements,
            i = this.openElements.stackTop,
            v = 0,

            TAG_ID = this.TAG_ID,
            InsertionMode = this.InsertionMode,
            tmplInsertionModeStack = this.tmplInsertionModeStack,

            TR = TAG_ID.TR,
            TBODY = TAG_ID.TBODY,
            THEAD = TAG_ID.THEAD,
            TFOOT = TAG_ID.TFOOT,
            CAPTION = TAG_ID.CAPTION,
            COLGROUP = TAG_ID.COLGROUP,
            TABLE = TAG_ID.TABLE,
            BODY = TAG_ID.BODY,
            FRAMESET = TAG_ID.FRAMESET,
            SELECT = TAG_ID.SELECT,
            TEMPLATE = TAG_ID.TEMPLATE,
            HTML = TAG_ID.HTML,
            TD = TAG_ID.TD,
            TH = TAG_ID.TH,
            HEAD = TAG_ID.HEAD,

            IN_ROW = InsertionMode.IN_ROW,
            IN_TABLE_BODY = InsertionMode.IN_TABLE_BODY,
            IN_CAPTION = InsertionMode.IN_CAPTION,
            IN_COLUMN_GROUP = InsertionMode.IN_COLUMN_GROUP,
            IN_TABLE = InsertionMode.IN_TABLE,
            IN_BODY = InsertionMode.IN_BODY,
            IN_FRAMESET = InsertionMode.IN_FRAMESET,
            AFTER_HEAD = InsertionMode.AFTER_HEAD,
            BEFORE_HEAD = InsertionMode.BEFORE_HEAD,
            IN_CELL = InsertionMode.IN_CELL
        ;
        r: {
            b: for (; i >= 0; i--) {
                if (
                    (
                        v = (
                            (
                                (i === 0)
                                &&
                                this.fragmentContext
                            )
                            ? this.fragmentContextID
                            : openElements.tagIDs[i]
                        )
                    ) === TR
                ) {
                    this.insertionMode = IN_ROW;
                    break r;
                }
                else if (
                    (v === TBODY)
                    ||
                    (v === THEAD)
                    ||
                    (v === TFOOT)
                ) {
                    this.insertionMode = IN_TABLE_BODY;
                    break r;
                }
                else if (
                    v === CAPTION
                ) {
                    this.insertionMode = IN_CAPTION;
                    break r;
                }
                else if (
                    v === COLGROUP
                ) {
                    this.insertionMode = IN_COLUMN_GROUP;
                    break r;
                }
                else if (
                    v === TABLE
                ) {
                    this.insertionMode = IN_TABLE;
                    break r;
                }
                else if (
                    v === BODY
                ) {
                    this.insertionMode = IN_BODY;
                    break r;
                }
                else if (
                    v === FRAMESET
                ) {
                    this.insertionMode = IN_FRAMESET;
                    break r;
                }
                else if (
                    v === SELECT
                ) {
                    this.reset_insertion_mode_for_select(i);
                    break r;
                }
                else if (
                    v === TEMPLATE
                ) {
                    this.insertionMode = tmplInsertionModeStack[0];
                    break r;
                }
                else if (
                    v === HTML
                ) {
                    this.insertionMode = (
                        this.headElement
                        ? AFTER_HEAD
                        : BEFORE_HEAD
                    );
                    break r;
                }
                else if (
                    (v === TD)
                    ||
                    (v === TH)
                ) {
                    if (i > 0) {
                        this.insertionMode = IN_CELL;
                        break r;
                    }
                    break b;
                }
                else if (
                    v === HEAD
                ) {
                    if (i > 0) {
                        this.insertionMode = InsertionMode.IN_HEAD;
                        break r;
                    }
                    break b;
                }
            }
            this.insertionMode = InsertionMode.IN_BODY;
        };
        
        return this;
    }
)
