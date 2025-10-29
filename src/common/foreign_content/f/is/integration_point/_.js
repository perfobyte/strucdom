import {NS, TAG_ID as _, ATTRS} from '../../../../html/i.js';
import is_html_integration_point from './html.js';
import is_math_ml_text_integration_point from './math_ml.js';

export default (
    (HTML, MATHML) => (tn, ns, attrs, foreignNS) => {
        return (
            (foreignNS)
            ? (
                (
                    (foreignNS === HTML)
                    &&
                    is_html_integration_point(tn, ns, attrs)
                )
                ||
                (
                    (foreignNS === MATHML)
                    &&
                    is_math_ml_text_integration_point(tn, ns)
                )
            )
            : (
                is_html_integration_point(tn, ns, attrs)
                ||
                is_math_ml_text_integration_point(tn, ns)
            )
        );
    }
)(
    NS.HTML,
    NS.MATHML,
);
