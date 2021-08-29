"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const model_1 = require("./model");
class ExtraRuneDetailController {
    constructor() {
        this.path = '/extra-rune-details';
        this.router = express_1.Router();
        this.newModel = model_1.default;
        this.getAll = async (request, response) => {
            const result = await this.newModel.find();
            response.send(result);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAll);
    }
}
exports.default = ExtraRuneDetailController;
//# sourceMappingURL=controller.js.map