"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const AuthenticationTokenMissingException_1 = require("../exceptions/AuthenticationTokenMissingException");
const WrongAuthenticationTokenException_1 = require("../exceptions/WrongAuthenticationTokenException");
const user_model_1 = require("../user/user.model");
async function authMiddleware(request, response, next) {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret);
            const id = verificationResponse._id;
            const user = await user_model_1.default.findById(id);
            if (user) {
                request.user = user;
                next();
            }
            else {
                next(new WrongAuthenticationTokenException_1.default());
            }
        }
        catch (error) {
            next(new WrongAuthenticationTokenException_1.default());
        }
    }
    else {
        next(new AuthenticationTokenMissingException_1.default());
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map