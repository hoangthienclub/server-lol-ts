import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import Champion from './summoner.interface';
import summonerModel from './summoner.model';

class SummonerController implements Controller {
  public path = '/summoners';
  public router = Router();
  private summoner = summonerModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllSummoners);
  }

  private getAllSummoners = async (request: Request, response: Response) => {
    const result = await this.summoner.find().sort({ name: 1 });
    response.send(result);
  }
}

export default SummonerController;
