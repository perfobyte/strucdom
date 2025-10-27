export default (
    (regex, map) => {
        return (data) => {
            var
                match = null,
                lastIndex = 0,
                result = "",
                mi = 0
            ;
            while ((match = regex.exec(data))) {
                if (lastIndex !== (mi = match.index)) {
                    result += data.substring(lastIndex, mi);
                }
                result += map.get(match[0].charCodeAt(0));
                lastIndex = mi + 1;
            }
            return result + data.substring(lastIndex);
        };
    }
);
