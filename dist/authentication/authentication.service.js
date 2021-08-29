"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserWithThatEmailAlreadyExistsException_1 = require("../exceptions/UserWithThatEmailAlreadyExistsException");
const user_model_1 = require("./../user/user.model");
class AuthenticationService {
    constructor() {
        this.user = user_model_1.default;
    }
    async register(userData) {
        if (await this.user.findOne({ email: userData.email })) {
            throw new UserWithThatEmailAlreadyExistsException_1.default(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    createToken(user) {
        const expiresIn = 60 * 60; // an hour
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
exports.default = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map