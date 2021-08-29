"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
    version: String,
    id: String,
    name: String,
    description: String,
    colloq: String,
    plaintext: String,
    into: Object,
    from: Object,
    image: Object,
    gold: Object,
    tags: Object,
    maps: Object,
    stats: Object,
    depth: Number,
    effect: Object,
    stacks: Number,
    consumed: Boolean,
    inStore: Boolean,
    hideFromAll: Boolean,
    consumeOnFull: Boolean,
    specialRecipe: Number,
    requiredChampion: String
});
const itemModel = mongoose.model('Item', itemSchema);
exports.default = itemModel;
//# sourceMappingURL=item.model.js.map