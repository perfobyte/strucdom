
export default (
    (codePoint) => {
        var
            _a = 0
        ;
        return (
            ((codePoint >= 55296) && (codePoint <= 57343))
            ||
            (codePoint > 1114111)
            ? 65533
            :
            (
                ((_a = decodeMap.get(codePoint)) !== null)
                &&
                (
                    (_a !== (void 0))
                    ? _a
                    : codePoint
                )
            )
        );
    }
);
