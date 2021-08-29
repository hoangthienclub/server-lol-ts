"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
    city: String,
    country: String,
    street: String,
});
const userSchema = new mongoose.Schema({
    address: addressSchema,
    email: String,
    firstName: String,
    lastName: String,
    role: {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        get: () => undefined,
    },
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
});
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
});
const userModel = mongoose.model('User', userSchema);
exports.default = userModel;
//# sourceMappingURL=user.model.js.map