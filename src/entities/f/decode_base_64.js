export default (
    (atob) => (input) => {
        var
            binary = atob(input),
            evenLength = (binary.length & ~1),
            out = new Uint16Array(evenLength / 2),
            index = 0,
            outIndex = 0
        ;
        for (; index < evenLength; index += 2) {
            out[outIndex++] = (
                binary.charCodeAt(index)
                |
                (binary.charCodeAt(index + 1) << 8)
            );
        }
        return out;
    }
)(
    (typeof atob === "function")
    ? atob
    : (
        (typeof Buffer.from === "function")
        ? (input) => (Buffer.from(input, "base64").toString("binary"))
        : (input) => (new Buffer(input, "base64").toString("binary"))
    )
);
