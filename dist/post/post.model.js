"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
    content: String,
    title: String,
});
const postModel = mongoose.model('Post', postSchema);
exports.default = postModel;
//# sourceMappingURL=post.model.js.map