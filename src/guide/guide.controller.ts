import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
// import authMiddleware from '../middleware/auth.middleware';
import Champion from './summoner.interface';
import guideModel from './guide.model';

import * as data from '../../data/summoner.json';

class GuideController implements Controller {
  public path = '/guides';
  public router = Router();
  private guide = guideModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllGuides);
    this.router.post(this.path, this.createGuide);

  }

  private getAllGuides = async (request: Request, response: Response) => {
    const result = await this.guide.find().sort({ name: 1 });
    response.send(result);
  };

  private createGuide = async (request: any, response: Response) => {
    const data: any = request.body;
    const createGuide = new this.guide(data);
    const saveGuide = await createGuide.save();
    response.send(saveGuide);
  }
}

export default GuideController;
