"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guide_model_1 = require("./guide.model");
class GuideController {
    constructor() {
        this.path = '/guides';
        this.router = express_1.Router();
        this.guide = guide_model_1.default;
        this.getAllGuides = async (request, response) => {
            const result = await this.guide.find().sort({ name: 1 });
            response.send(result);
        };
        this.createGuide = async (request, response) => {
            const data = request.body;
            const createGuide = new this.guide(data);
            const saveGuide = await createGuide.save();
            response.send(saveGuide);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllGuides);
        this.router.post(this.path, this.createGuide);
    }
}
exports.default = GuideController;
//# sourceMappingURL=guide.controller.js.map