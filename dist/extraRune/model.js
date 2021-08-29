"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    version: {
        type: String,
        default: '11.16.1'
    },
    id: Number,
    name: String,
    options: Object
});
const model = mongoose.model('ExtraRune', schema);
exports.default = model;
//# sourceMappingURL=model.js.map