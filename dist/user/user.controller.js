"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotAuthorizedException_1 = require("../exceptions/NotAuthorizedException");
const auth_middleware_1 = require("../middleware/auth.middleware");
const post_model_1 = require("../post/post.model");
const user_model_1 = require("./user.model");
const UserNotFoundException_1 = require("../exceptions/UserNotFoundException");
class UserController {
    constructor() {
        this.path = '/users';
        this.router = express_1.Router();
        this.post = post_model_1.default;
        this.user = user_model_1.default;
        this.getUserById = async (request, response, next) => {
            const id = request.params.id;
            const userQuery = this.user.findById(id);
            if (request.query.withPosts === 'true') {
                userQuery.populate('posts').exec();
            }
            const user = await userQuery;
            if (user) {
                response.send(user);
            }
            else {
                next(new UserNotFoundException_1.default(id));
            }
        };
        this.getAllPostsOfUser = async (request, response, next) => {
            const userId = request.params.id;
            if (userId === request.user._id.toString()) {
                const posts = await this.post.find({ author: userId });
                response.send(posts);
            }
            next(new NotAuthorizedException_1.default());
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/:id`, auth_middleware_1.default, this.getUserById);
        this.router.get(`${this.path}/:id/posts`, auth_middleware_1.default, this.getAllPostsOfUser);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map