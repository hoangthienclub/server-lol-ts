"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    version: {
        type: String,
        default: '11.16.1'
    },
    id: Number,
    key: String,
    icon: String,
    name: String,
    shortDesc: String,
    longDesc: String
});
const model = mongoose.model('RuneDetail', schema);
exports.default = model;
//# sourceMappingURL=runeDetail.model.js.map