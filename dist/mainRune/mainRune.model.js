"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mainRuneSchema = new mongoose.Schema({
    version: {
        type: String,
        default: '11.16.1'
    },
    id: Number,
    key: String,
    icon: String,
    name: String,
    slots: Object
});
const mainRuneModel = mongoose.model('Mainrune', mainRuneSchema);
exports.default = mainRuneModel;
//# sourceMappingURL=mainRune.model.js.map