import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import Champion from './champion.interface';
import championModel from './champion.model';

class ChampionController implements Controller {
  public path = '/champions';
  public router = Router();
  private champion = championModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllChampions);
    this.router.get(`${this.path}/:id`, this.getChampionId);
  }

  private getAllChampions = async (request: Request, response: Response) => {
    const champions = await this.champion.find().sort({ name: 1 });
    const result = champions.map((champion) => {
      const item: any = champion.toJSON();
      item.image.url = `https://cdngarenanow-a.akamaihd.net/games/lol/2020/LOLwebsite/champion/${item.id}_0.jpg`;
      item.image.square = `http://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/${item.id}.png`;

      item.skins = item.skins.map((skin: any) => ({
        ...skin,
        image: `https://cdngarenanow-a.akamaihd.net/webmain/static/pss/lol/items_splash/${item.id.toLowerCase()}_${
          skin.num
        }.jpg`,
      }));

      item.spells = item.spells.map((spell: any) => ({
        ...spell,
        image: `https://ddragon.leagueoflegends.com/cdn/11.16.1/img/spell/${spell.id}.png`,
      }));

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
        skins: item.skins.map((i: any) => ({
          name: i.name === 'default' ? 'Mặc Định' : i.name,
          image: i.image,
        })),
        spells: item.spells.map((i: any) => ({
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

  private getChampionId = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const post = await this.champion.findOne({
      id,
    });

    if (post) {
      const result = post.toJSON();
      result.image.url = `${
        process.env.SERVER_URL
      }/images/champions/${result.id.toLowerCase()}/images/${result.id.toLowerCase()}_0.jpg`;

      result.skins = result.skins.map((skin: any) => ({
        ...skin,
        image: `${
          process.env.SERVER_URL
        }/images/champions/${result.id.toLowerCase()}/skins/${skin.num}.jpg`,
      }));
      result.spells = result.spells.map((spell: any) => ({
        ...spell,
        image: `${
          process.env.SERVER_URL
        }/images/champions/${result.id.toLowerCase()}/skills/images/${spell.id}.png`,
        video: `${
          process.env.SERVER_URL
        }/images/champions/${result.id.toLowerCase()}/skills/videos/${spell.id}.mp4`,
      }));
      response.send(result);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default ChampionController;
