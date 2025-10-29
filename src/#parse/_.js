export default (
    (Parser, html, options) => {
        var
            parser = new Parser(options)
        ;
        return (
            parser.tokenizer.write(html, true),
            parser.document
        );
    }
);
