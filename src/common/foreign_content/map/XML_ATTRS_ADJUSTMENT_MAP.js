import {NS} from '../../html/i.js';

export default (
    (XLINK, XML, XMLNS) => new Map([
        ['xlink:actuate', { prefix: 'xlink', name: 'actuate', namespace: XLINK }],
        ['xlink:arcrole', { prefix: 'xlink', name: 'arcrole', namespace: XLINK }],
        ['xlink:href', { prefix: 'xlink', name: 'href', namespace: XLINK }],
        ['xlink:role', { prefix: 'xlink', name: 'role', namespace: XLINK }],
        ['xlink:show', { prefix: 'xlink', name: 'show', namespace: XLINK }],
        ['xlink:title', { prefix: 'xlink', name: 'title', namespace: XLINK }],
        ['xlink:type', { prefix: 'xlink', name: 'type', namespace: XLINK }],
        ['xml:lang', { prefix: 'xml', name: 'lang', namespace: XML }],
        ['xml:space', { prefix: 'xml', name: 'space', namespace: XML }],
        ['xmlns', { prefix: '', name: 'xmlns', namespace: XMLNS }],
        ['xmlns:xlink', { prefix: 'xmlns', name: 'xlink', namespace: XMLNS }],
    ])
)(
    NS.XLINK,
    NS.XML,
    NS.XMLNS
);
