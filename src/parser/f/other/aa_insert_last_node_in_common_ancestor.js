import {get_tag_id, TAG_ID, NS} from '../../../common/i.js';
import {append_child} from '../../../tree_adapters/i.js';

export default (
    (TEMPLATE, HTML) =>
    
    (p, commonAncestor, lastElement) => {
        var
            tid = get_tag_id(commonAncestor.tagName)
        ;
        return (
            p.is_element_causes_foster_parenting(tid)
            ? p.foster_parent_element(lastElement)
            : (
                append_child(
                    (
                        (
                            (tid === TEMPLATE)
                            &&
                            ((commonAncestor.namespaceURI) === HTML)
                        )
                        ? commonAncestor.content
                        : commonAncestor
                    ),
                    lastElement
                )
            )
        );
    }
)(
    TAG_ID.TEMPLATE,
    NS.HTML
)