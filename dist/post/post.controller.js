"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostNotFoundException_1 = require("../exceptions/PostNotFoundException");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const post_dto_1 = require("./post.dto");
const post_model_1 = require("./post.model");
class PostController {
    constructor() {
        this.path = '/posts';
        this.router = express_1.Router();
        this.post = post_model_1.default;
        this.getAllPosts = async (request, response) => {
            const posts = await this.post.find()
                .populate('author', '-password');
            response.send(posts);
        };
        this.getPostById = async (request, response, next) => {
            const id = request.params.id;
            const post = await this.post.findById(id);
            if (post) {
                response.send(post);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.modifyPost = async (request, response, next) => {
            const id = request.params.id;
            const postData = request.body;
            const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
            if (post) {
                response.send(post);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.createPost = async (request, response) => {
            const postData = request.body;
            const createdPost = new this.post(Object.assign(Object.assign({}, postData), { author: request.user._id }));
            const savedPost = await createdPost.save();
            await savedPost.populate('author', '-password').execPopulate();
            response.send(savedPost);
        };
        this.deletePost = async (request, response, next) => {
            const id = request.params.id;
            const successResponse = await this.post.findByIdAndDelete(id);
            if (successResponse) {
                response.send(200);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, auth_middleware_1.default)
            .patch(`${this.path}/:id`, validation_middleware_1.default(post_dto_1.default, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, auth_middleware_1.default, validation_middleware_1.default(post_dto_1.default), this.createPost);
    }
}
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map