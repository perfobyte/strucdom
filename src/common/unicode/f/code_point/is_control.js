
export default (
    (cp) => {
        return (
            (
                (cp !== 0x20)
                &&
                (cp !== 0x0a)
                &&
                (cp !== 0x0d)
                &&
                (cp !== 0x09)
                &&
                (cp !== 0x0c)
                &&
                (cp >= 0x01)
                &&
                (cp <= 0x1f)
            )
            ||
            (
                (cp >= 0x7f)
                &&
                (cp <= 0x9f)
            )
        );
    }
);
