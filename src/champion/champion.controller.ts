import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import Champion from './champion.interface';
import championModel from './champion.model';
import * as constants from '../utils/constant';

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
      item.image.url = `${constants.URL_IMAGE_CHAMPION}/${item.id}_0.jpg`;
      item.image.square = `${constants.URL_IMAGE_CHAMPION_SQUARE}/${item.id}.png`;

      item.skins = item.skins.map((skin: any) => ({
        ...skin,
        image: `${constants.URL_IMAGE_CHAMPION_SPLASH}/${item.id}_${
          skin.num
        }.jpg`,
      }));

      item.spells = item.spells.map((spell: any) => ({
        ...spell,
        image: `${constants.URL_IMAGE_CHAMPION_SPELL}/${spell.id}.png`,
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
      result.image.url = `${constants.URL_IMAGE_SUMMONER}/${result.id}_0.jpg`;

      result.skins = result.skins.map((skin: any) => ({
        ...skin,
        image: `${constants.URL_IMAGE_CHAMPION_SPLASH}/${result.id}_${
          skin.num
        }.jpg`
      }));
      result.spells = result.spells.map((spell: any) => ({
        ...spell,
        image: `${constants.URL_IMAGE_CHAMPION_SPELL}/${spell.id}.png`,
      }));
      response.send(result);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default ChampionController;
