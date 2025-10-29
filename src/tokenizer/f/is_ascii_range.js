export default (
    (from,to) => (
        (cp) => {
            return ((cp >= from) && (cp <= to));
        }
    )
);
