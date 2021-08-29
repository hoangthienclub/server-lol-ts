"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const championSchema = new mongoose.Schema({
    version: String,
    id: String,
    key: String,
    name: String,
    title: String,
    blurb: String,
    info: Object,
    image: Object,
    tags: Object,
    partype: String,
    stats: Object,
    allytips: Object,
    enemytips: Object,
    lore: String,
    passive: Object,
    recommended: Object,
    skins: Object,
    spells: Object,
    thumbnail: String,
});
const championModel = mongoose.model('Champion', championSchema);
exports.default = championModel;
//# sourceMappingURL=champion.model.js.map