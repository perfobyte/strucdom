
export default (
    function(newElement) {
        var
            entries = this.entries,
            c_l = 0,
            i = 0,

            NOAH_ARK_CAPACITY = this.NOAH_ARK_CAPACITY,

            attrs = null,
            validCandidates = 0,

            neAttrsMap = null,
            candidate = null,
            cevery = null
        ;
        if (
            (entries.length >= NOAH_ARK_CAPACITY)
            &&
            (
                (
                    c_l =
                        (
                            candidates =
                                this
                                .get_noah_ark_condition_candidates(
                                    newElement,
                                    (attrs = (newElement.attrs))
                                )
                        )
                        .length
                )
                >= NOAH_ARK_CAPACITY
            )
        ) {
            cevery = (
                this.c_attrs_every(
                    new Map(
                        attrs.map(this.attrs_map)
                    )
                )
            );
            for(;i<c_l;i++) {
                
                (candidate = candidates[i]).attrs.every(cevery)
                &&
                (
                    (validCandidates += 1),

                    (validCandidates >= NOAH_ARK_CAPACITY)
                    &&
                    (entries.splice(candidate.idx, 1))
                ),
            }
        }
        return undefined;
    }
)