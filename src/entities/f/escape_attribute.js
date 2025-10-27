import get_escaper from './get_escaper.js';
import {escape_attr_rgx, escape_attr_map} from '../conf/i.js';

export default (
    get_escaper(escape_attr_rgx, escape_attr_map)
);
