"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const summonerSchema = new mongoose.Schema({
    version: String,
    id: String,
    name: String,
    description: String,
    tooltip: String,
    maxrank: Number,
    cooldown: Object,
    cooldownBurn: String,
    cost: Object,
    costBurn: String,
    datavalues: Object,
    effect: Object,
    effectBurn: Object,
    vars: Object,
    key: String,
    summonerLevel: Number,
    modes: Object,
    costType: String,
    maxammo: String,
    range: Object,
    rangeBurn: String,
    image: Object,
    resource: String
});
const summonerModel = mongoose.model('Summoner', summonerSchema);
exports.default = summonerModel;
//# sourceMappingURL=summoner.model.js.map