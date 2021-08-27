import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import itemModel from './item.model';
import * as constants from '../utils/constant';

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
      const responseData = result.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        plaintext: item.plaintext,
        image: `${constants.URL_IMAGE_ITEM}/${item.image.full}`,
        gold: {
          total: item.gold.total,
          sell: item.gold.sell,
        },
        tags: item.tags,
        from:
          item.from && item.from.length > 0
            ? item.from.map((i: any) => ({
                id: i.id,
                image: `${constants.URL_IMAGE_ITEM}/${i.image.full}`,
                from:
                  i.from && i.from.length > 0
                    ? i.from.map((j: any) => ({
                        id: j,
                        image: `${constants.URL_IMAGE_ITEM}/${j}.png`,
                      }))
                    : [],
              }))
            : [],
      }));
      response.send({
        code: 200,
        data: responseData,
      });
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
