import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import model from './runeDetail.model';

import * as data from '../../data/runeDetails.json';

class RuneDetailController implements Controller {
  public path = '/rune-details';
  public router = Router();
  private runeDetail = model;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllRuneDetail);
  }

  private getAllRuneDetail = async (request: Request, response: Response) => {
    const result = await this.runeDetail.find();
    response.send(result);
  }
}

export default RuneDetailController;
