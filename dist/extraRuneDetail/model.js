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
});
const model = mongoose.model('ExtraRuneDetail', schema);
exports.default = model;
//# sourceMappingURL=model.js.map