"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mainRune_model_1 = require("./mainRune.model");
class SummonerController {
    constructor() {
        this.path = '/main-runes';
        this.router = express_1.Router();
        this.mainRune = mainRune_model_1.default;
        this.getAllRunes = async (request, response) => {
            const result = await this.mainRune.find();
            response.send(result);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllRunes);
    }
}
exports.default = SummonerController;
//# sourceMappingURL=mainRune.controller.js.map