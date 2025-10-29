
import append_child from './append_child.js';

export default (
    (find_cb) =>
    
    (document, name, publicId, systemId) => {
        var
            doctypeNode = (
                document
                .childNodes
                .find(find_cb)
            )
        ;
        return (
            (doctypeNode)
            ? (
                doctypeNode.name = name;
                doctypeNode.publicId = publicId;
                doctypeNode.systemId = systemId;
            )
            : (
                append_child(document, {
                    nodeName: '#documentType',
                    name,
                    publicId,
                    systemId,
                    parentNode: null,
                })
            ),
            doctypeNode
        );
    }
)(
    (node) => node.nodeName === '#documentType'
);