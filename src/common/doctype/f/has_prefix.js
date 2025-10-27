

export default (
    (publicId, prefixes) => {
        return prefixes.some((prefix) => publicId.startsWith(prefix));
    }
);
