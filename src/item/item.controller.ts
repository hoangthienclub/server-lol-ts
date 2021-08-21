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
    this.router.get(`${this.path}/:id`, this.getItemId);
  }

  private getAllItems = async (request: Request, response: Response) => {
    try {
      const result = await this.item.aggregate([
        {
          $lookup: {
            from: 'items',
            localField: 'from',
            foreignField: 'id',
            as: 'from',
          },
        },
        {
          $sort: { id: 1 },
        },
      ]);

      response.send(result);
    } catch (err) {
      console.log(err);
    }
  };

  private getItemId = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const result = await this.item.aggregate([
      {
        $match: { id },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'from',
          foreignField: 'id',
          as: 'from',
        },
      },
    ]);
    if (result && result.length > 0) {
      const item = {
        ...result[0],
        from: result[0].from.map((i: any) => ({
          _id: i._id,
          id: i.id,
          from: i.from,
        })),
      };

      response.send(item);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default ItemController;
