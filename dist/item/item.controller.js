"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostNotFoundException_1 = require("../exceptions/PostNotFoundException");
const item_model_1 = require("./item.model");
class ItemController {
    constructor() {
        this.path = '/items';
        this.router = express_1.Router();
        this.item = item_model_1.default;
        this.getAllItems = async (request, response) => {
            try {
                const result = await this.item.aggregate([
                    {
                        $lookup: {
                            from: 'items',
                            localField: 'from',
                            foreignField: 'id',
                            as: 'from',
                        },
                    },
                    {
                        $sort: { id: 1 },
                    },
                ]);
                response.send(result);
            }
            catch (err) {
                console.log(err);
            }
        };
        this.getItemId = async (request, response, next) => {
            const id = request.params.id;
            const result = await this.item.aggregate([
                {
                    $match: { id },
                },
                {
                    $lookup: {
                        from: 'items',
                        localField: 'from',
                        foreignField: 'id',
                        as: 'from',
                    },
                },
            ]);
            if (result && result.length > 0) {
                const item = Object.assign(Object.assign({}, result[0]), { from: result[0].from.map((i) => ({
                        _id: i._id,
                        id: i.id,
                        from: i.from,
                    })) });
                response.send(item);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllItems);
        this.router.get(`${this.path}/:id`, this.getItemId);
    }
}
exports.default = ItemController;
//# sourceMappingURL=item.controller.js.map