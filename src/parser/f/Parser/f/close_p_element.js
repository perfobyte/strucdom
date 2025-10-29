

export default (
    function() {
        var
            o = this.openElements,
            P = this.TAG_ID.P
        ;
        return (
            o.generateImpliedEndTagsWithExclusion(P),
            o.popUntilTagNamePopped(P)
        );
    }
);
