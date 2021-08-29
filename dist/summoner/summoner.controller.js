"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const summoner_model_1 = require("./summoner.model");
class SummonerController {
    constructor() {
        this.path = '/summoners';
        this.router = express_1.Router();
        this.summoner = summoner_model_1.default;
        this.getAllSummoners = async (request, response) => {
            const result = await this.summoner.find().sort({ name: 1 });
            response.send(result);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllSummoners);
    }
}
exports.default = SummonerController;
//# sourceMappingURL=summoner.controller.js.map