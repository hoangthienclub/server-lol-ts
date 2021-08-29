"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const express_1 = require("express");
const jwt = require("jsonwebtoken");
const WrongCredentialsException_1 = require("../exceptions/WrongCredentialsException");
const validation_middleware_1 = require("../middleware/validation.middleware");
const user_dto_1 = require("../user/user.dto");
const user_model_1 = require("./../user/user.model");
const authentication_service_1 = require("./authentication.service");
const logIn_dto_1 = require("./logIn.dto");
class AuthenticationController {
    constructor() {
        this.path = '/auth';
        this.router = express_1.Router();
        this.authenticationService = new authentication_service_1.default();
        this.user = user_model_1.default;
        this.registration = async (request, response, next) => {
            const userData = request.body;
            try {
                const { cookie, user } = await this.authenticationService.register(userData);
                response.setHeader('Set-Cookie', [cookie]);
                response.send(user);
            }
            catch (error) {
                next(error);
            }
        };
        this.loggingIn = async (request, response, next) => {
            const logInData = request.body;
            const user = await this.user.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = await bcrypt.compare(logInData.password, user.get('password', null, { getters: false }));
                if (isPasswordMatching) {
                    const tokenData = this.createToken(user);
                    response.send({
                        code: 200,
                        data: Object.assign(Object.assign({}, user.toJSON()), { accessToken: tokenData.token }),
                    });
                }
                else {
                    next(new WrongCredentialsException_1.default());
                }
            }
            else {
                next(new WrongCredentialsException_1.default());
            }
        };
        this.loggingOut = (request, response) => {
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.send(200);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_middleware_1.default(user_dto_1.default), this.registration);
        this.router.post(`${this.path}/login`, validation_middleware_1.default(logIn_dto_1.default), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }
    createToken(user) {
        const expiresIn = 60 * 60 * 24 * 30; // a month
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map