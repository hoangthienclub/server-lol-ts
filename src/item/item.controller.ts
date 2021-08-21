import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import itemModel from './item.model';

class ItemController implements Controller {
  public path = '/items';
  public router = Router();
  private item = itemModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllItems);
  }

  private getAllItems = async (request: Request, response: Response) => {
    const items = await this.item.find().sort({ id: 1 });
    const result = items.map((item) => ({
      ...item.toJSON(),
      image: `${
        process.env.SERVER_URL
      }/images/images/${item.id}.png`,
    }));
    response.send(result);
  };
}

export default ItemController;
