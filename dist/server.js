"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const authentication_controller_1 = require("./authentication/authentication.controller");
const post_controller_1 = require("./post/post.controller");
const report_controller_1 = require("./report/report.controller");
const user_controller_1 = require("./user/user.controller");
const champion_controller_1 = require("./champion/champion.controller");
const item_controller_1 = require("./item/item.controller");
const summoner_controller_1 = require("./summoner/summoner.controller");
const guide_controller_1 = require("./guide/guide.controller");
const mainRune_controller_1 = require("./mainRune/mainRune.controller");
const runeDetail_controller_1 = require("./runeDetail/runeDetail.controller");
const controller_1 = require("./extraRune/controller");
const controller_2 = require("./extraRuneDetail/controller");
const validateEnv_1 = require("./utils/validateEnv");
validateEnv_1.default();
const app = new app_1.default([
    new post_controller_1.default(),
    new authentication_controller_1.default(),
    new user_controller_1.default(),
    new report_controller_1.default(),
    new champion_controller_1.default(),
    new item_controller_1.default(),
    new summoner_controller_1.default(),
    new guide_controller_1.default(),
    new mainRune_controller_1.default(),
    new runeDetail_controller_1.default(),
    new controller_1.default(),
    new controller_2.default(),
]);
app.listen();
//# sourceMappingURL=server.js.map