import get_escaper from "./get_escaper.js";
import {escape_text_rgx, escape_text_map} from '../conf/i.js';

export default get_escaper(escape_text_rgx, escape_text_map);
