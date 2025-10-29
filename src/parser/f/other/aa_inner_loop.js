import aa_recreate_element_from_entry from './aa_recreate_element_from_entry.js';
import {detach_node, append_child} from '../../../tree_adapters/i.js';
import {AA_INNER_LOOP_ITER} from '../../conf/i.js';

export default (
    (p, furthestBlock, formattingElement) => {
        var
            openElements = p.openElements,
            active = p.activeFormattingElements,

            lastElement = furthestBlock,
            nextElement = openElements.getCommonAncestor(furthestBlock),

            i = 0,
            element = nextElement,
            elementEntry = null,
            counterOverflow = false
        ;
        
        for (
            ;
            element !== formattingElement;
            (
                (i++),
                (element = nextElement)
            )
        ) {
            nextElement = openElements.getCommonAncestor(element);
            
            
            (
                (
                    !(
                        elementEntry = active.getElementEntry(element)    
                    )
                )
                ||
                (
                    counterOverflow =
                        (elementEntry)
                        &&
                        (i >= AA_INNER_LOOP_ITER)
                )
            )
            ? (
                (counterOverflow)
                &&
                active.removeEntry(elementEntry),
                
                openElements.remove(element)
            )
            : (
                (element = aa_recreate_element_from_entry(p, elementEntry)),

                (lastElement === furthestBlock)
                &&
                (active.bookmark = elementEntry),

                detach_node(lastElement),
                append_child(element, lastElement),
                (lastElement = element)
            );
        }
        return lastElement;
    }
)