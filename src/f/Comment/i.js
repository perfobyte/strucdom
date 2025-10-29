import * as f from './f/i.js';


function Comment(data, parentNode) {
    this.data = data;
    this.parentNode = parentNode;
};
Comment.prototype = f;
export default Comment;
