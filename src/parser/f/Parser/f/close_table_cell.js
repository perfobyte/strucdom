

export default (
    function() {
        var
            openElements = this.openElements
        ;
        return (
            openElements.generateImpliedEndTags(),
            openElements.popUntilTableCellPopped(),
            this.activeFormattingElements.clearToLastMarker(),
            (this.insertionMode = this.InsertionMode.IN_ROW),
            this
        );
    }
);
