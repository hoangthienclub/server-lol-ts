import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import championModel from './champion.model';
import guideModel from '../guide/guide.model';
import * as constants from '../utils/constant';

class ChampionController implements Controller {
  public path = '/champions';
  public router = Router();
  private champion = championModel;
  private guide = guideModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllChampions);
    this.router.get(`${this.path}/:id`, this.getChampionId);
  }

  private getAllChampions = async (request: Request, response: Response) => {
    const champions = await this.champion
      .find()
      .select('id key name title image tags ')
      .sort({ name: 1 });
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
      data: result,
    });
  };

  private getChampionId = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const post = await this.champion.findOne({
      id,
    });

    if (post) {
      const r = post.toJSON();
      const guides = await this.guide.find({ championId: r.key }).select('path');
      const responseData = {
        id: r.id,
        key: r.key,
        name: r.name,
        title: r.title,
        image: {
          url: `${constants.URL_IMAGE_CHAMPION}/${r.id}_0.jpg`,
          square: `${constants.URL_IMAGE_CHAMPION_SQUARE}/${r.id}.png`,
        },
        tags: r.tags,
        lore: r.lore,
        passive: {
          name: r.passive.name,
          description: r.passive.description,
          image: `${constants.URL_IMAGE_CHAMPION_PASSIVE}/${r.passive.image.full}`,
        },
        spells: r.spells.map((spell: any) => ({
          id: spell.id,
          name: spell.name,
          description: spell.description,
          image: `${constants.URL_IMAGE_CHAMPION_SPELL}/${spell.id}.png`,
        })),
        Skins: r.skins.map((skin: any) => ({
          ...skin,
          image: `${constants.URL_IMAGE_CHAMPION_SPLASH}/${r.id}_${skin.num}.jpg`,
        })),
        guides,
      };
      response.send({
        code: 200,
        data: responseData,
      });
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default ChampionController;
