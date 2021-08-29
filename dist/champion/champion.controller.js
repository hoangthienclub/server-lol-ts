"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostNotFoundException_1 = require("../exceptions/PostNotFoundException");
const champion_model_1 = require("./champion.model");
class ChampionController {
    constructor() {
        this.path = '/champions';
        this.router = express_1.Router();
        this.champion = champion_model_1.default;
        this.getAllChampions = async (request, response) => {
            const champions = await this.champion.find().sort({ name: 1 });
            const result = champions.map((champion) => {
                const item = champion.toJSON();
                item.image.url = `https://cdngarenanow-a.akamaihd.net/games/lol/2020/LOLwebsite/champion/${item.id}_0.jpg`;
                item.image.square = `http://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/${item.id}.png`;
                item.skins = item.skins.map((skin) => (Object.assign(Object.assign({}, skin), { image: `https://cdngarenanow-a.akamaihd.net/webmain/static/pss/lol/items_splash/${item.id.toLowerCase()}_${skin.num}.jpg` })));
                item.spells = item.spells.map((spell) => (Object.assign(Object.assign({}, spell), { image: `https://ddragon.leagueoflegends.com/cdn/11.16.1/img/spell/${spell.id}.png` })));
                return {
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    title: item.title,
                    info: item.info,
                    image: {
                        default: item.image.url,
                        square: item.image.square,
                    },
                    tags: item.tags,
                    skins: item.skins.map((i) => ({
                        name: i.name === 'default' ? 'Mặc Định' : i.name,
                        image: i.image,
                    })),
                    spells: item.spells.map((i) => ({
                        id: i.id,
                        name: i.name,
                        description: i.description,
                        cooldownBurn: i.cooldownBurn,
                        costBurn: i.costBurn,
                        image: i.image
                    })),
                };
            });
            response.send(result);
        };
        this.getChampionId = async (request, response, next) => {
            const id = request.params.id;
            const post = await this.champion.findOne({
                id,
            });
            if (post) {
                const result = post.toJSON();
                result.image.url = `${process.env.SERVER_URL}/images/champions/${result.id.toLowerCase()}/images/${result.id.toLowerCase()}_0.jpg`;
                result.skins = result.skins.map((skin) => (Object.assign(Object.assign({}, skin), { image: `${process.env.SERVER_URL}/images/champions/${result.id.toLowerCase()}/skins/${skin.num}.jpg` })));
                result.spells = result.spells.map((spell) => (Object.assign(Object.assign({}, spell), { image: `${process.env.SERVER_URL}/images/champions/${result.id.toLowerCase()}/skills/images/${spell.id}.png`, video: `${process.env.SERVER_URL}/images/champions/${result.id.toLowerCase()}/skills/videos/${spell.id}.mp4` })));
                response.send(result);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllChampions);
        this.router.get(`${this.path}/:id`, this.getChampionId);
    }
}
exports.default = ChampionController;
//# sourceMappingURL=champion.controller.js.map