import {AA_OUTER_LOOP_ITER} from '../../conf/i.js';
import aa_obtain_formatting_element_entry from './aa_obtain_formatting_element_entry.js';
import aa_obtain_furthest_block from './aa_obtain_furthest_block.js';
import aa_inner_loop from './aa_inner_loop.js';
import aa_insert_last_node_in_common_ancestor from './aa_insert_last_node_in_common_ancestor.js';
import aa_replace_formatting_element from './aa_replace_formatting_element.js';
import {detach_node} from '../../../tree_adapters/i.js';


export default (
    (p, token) => {
        var
            i = 0,
            fentry = null,
            furthestBlock = null,
            lastElement = null,
            e = null,
            commonAncestor = null,

            openElements = p.openElements,
            active = p.activeFormattingElements,
            l = AA_OUTER_LOOP_ITER
        ;
        for (; i < l; i++) {
            if (
                !(
                    fentry = aa_obtain_formatting_element_entry(p, token)
                )
            ) {
                break;
            };
            
            if (
                !(
                    furthestBlock = aa_obtain_furthest_block(p, fentry)
                )
            ) {
                break;
            };

            lastElement =
                aa_inner_loop(
                    p,
                    furthestBlock,
                    (
                        e =
                            (
                                active.bookmark = fentry
                            )
                            .element
                    )
                )
            ;
            commonAncestor = openElements.getCommonAncestor(e);
            detach_node(lastElement);

            (commonAncestor)
            &&
            aa_insert_last_node_in_common_ancestor(p, commonAncestor, lastElement);

            aa_replace_formatting_element(p, furthestBlock, fentry);
        };
        return i;
    }
);
