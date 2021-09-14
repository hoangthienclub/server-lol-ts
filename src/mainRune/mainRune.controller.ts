import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import MainRune from './mainRune.interface';
import MainRuneModel from './mainRune.model';
import { responseSuccess } from '../utils/helpers';

class SummonerController implements Controller {
  public path = '/main-runes';
  public router = Router();
  private mainRune = MainRuneModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllRunes);
  }

  private getAllRunes = async (request: Request, response: Response) => {
    const result = await this.mainRune.find();
    responseSuccess(response, result);
  };
}

export default SummonerController;
