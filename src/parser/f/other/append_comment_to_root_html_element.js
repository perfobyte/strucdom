

export default (
    (p, token) => {
        return p.append_comment_node(token, p.openElements.items[0]);
    }
);
