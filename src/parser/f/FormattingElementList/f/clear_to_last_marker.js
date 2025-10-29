

export default (
    function() {
        var
            entries = this.entries,
            markerIdx = entries.indexOf(this.MARKER)
        ;
        return (
            (markerIdx === -1)
            ? (entries.length = 0)
            : (entries.splice(0, (markerIdx + 1))),

            this
        );
    }
);
