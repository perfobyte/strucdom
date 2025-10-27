import {SVG_TAG_NAMES_ADJUSTMENT_MAP} from "../../map/i.js";
import {get_tag_id} from '../../../html/i.js';

export default (
    (token) => {
        var
            tagName = token.tagName,
            n = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(tagName)
        ;
        return (
            (n === null)
            ||
            (
                (token.tagName = n),
                (token.tagID = get_tag_id(tagName))
            ),
            undefined
        );
        
    }
);
