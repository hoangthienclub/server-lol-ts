import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import Champion from './champion.interface';
import championModel from './champion.model';

import * as data from '../../data/championDetail.json';

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
    const champions = await this.champion.find().sort({ name: 1 }).select('id name tags').limit(5);
    const result = champions.map((champion) => ({
      ...champion.toJSON(),
      thumbnail: `${
        process.env.SERVER_URL
      }/images/champions/${champion.id.toLowerCase()}/thumbnails/${champion.id}_0.jpg`,
    }));
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
