export default (
    (fragmentContext, options, Parser, create_element) => {
        var
            NS_HTML = NS.HTML,
            parser = new Parser(
                options,
                create_element('documentmock', NS_HTML, []),
                (fragmentContext ??= (create_element(TAG_NAMES.TEMPLATE, NS_HTML, [])))
            )
        ;
        return (
            (parser.fragmentContextID === parser.TAG_ID.TEMPLATE)
            &&
            parser.tmplInsertionModeStack.unshift(parser.InsertionMode.IN_TEMPLATE),

            parser.init_tokenizer_for_fragment_parsing(),
            parser.insert_fake_root_element(),
            parser.reset_insertion_mode(),
            parser.find_form_in_fragment_context(),
            parser
        );
    }
)