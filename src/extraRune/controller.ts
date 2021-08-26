import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import model from './model';

class ExtraRuneController implements Controller {
  public path = '/extra-runes';
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
    response.send(result);
  };
}

export default ExtraRuneController;
