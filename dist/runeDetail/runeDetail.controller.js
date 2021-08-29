"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const runeDetail_model_1 = require("./runeDetail.model");
class RuneDetailController {
    constructor() {
        this.path = '/rune-details';
        this.router = express_1.Router();
        this.runeDetail = runeDetail_model_1.default;
        this.getAllRuneDetail = async (request, response) => {
            const result = await this.runeDetail.find();
            response.send(result);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllRuneDetail);
    }
}
exports.default = RuneDetailController;
//# sourceMappingURL=runeDetail.controller.js.map