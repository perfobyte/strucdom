export default (
    function() {
        var 
            d = this.data,
            n = this.name,
            space = this.SpaceCharacters,
            q = this.QuotesCharacters,

            i = 0,
            l = space.length
        ;

        return (
            (this.data.length > 0)
            ? (
                d.includes('"')
                ? `${n}="${d.replace(this.quote_rgx, '&quot;')}"`
                : `${n}="${d}"`
            )
            : n
        )
    }
)