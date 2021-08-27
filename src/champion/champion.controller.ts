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
    const champions = await this.champion.find().select('id key name title image tags ').sort({ name: 1 });
    const result = champions.map((champion) => {
      const item: any = champion.toJSON();
      return {
        id: item.id,
        key: item.key,
        name: item.name,
        title: item.title,
        image: {
          url: `${constants.URL_IMAGE_CHAMPION}/${item.id}_0.jpg`,
          square: `${constants.URL_IMAGE_CHAMPION_SQUARE}/${item.id}.png`,
        },
        tags: item.tags,
      };
    });
    response.send({
      code: 200,
      data: result
    });
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
