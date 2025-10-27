
export default (
    (cp1, cp2) => {
        return (((cp1 - 55296) * 1024) + 9216 + cp2);
    }
);
