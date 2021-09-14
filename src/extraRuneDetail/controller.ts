import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import model from './model';
import { responseSuccess } from '../utils/helpers';

class ExtraRuneDetailController implements Controller {
  public path = '/extra-rune-details';
  public router = Router();
  private newModel = model;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
  }

  private getAll = async (request: Request, response: Response) => {
    const result = await this.newModel.find();
    responseSuccess(response, result);
  };
}

export default ExtraRuneDetailController;
