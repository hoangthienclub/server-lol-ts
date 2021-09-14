import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import model from './model';
import * as fs from 'fs';
import { replaceAll, responseSuccess } from '../utils/helpers';
import * as constants from '../utils/constant';

class ExtraRuneController implements Controller {
  public path = '/banners';
  public router = Router();
  private newModel = model;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, authMiddleware, this.create);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteBanner);
    this.router.get(this.path, this.getAll);
  }

  private getAll = async (request: Request, response: Response) => {
    const result = await this.newModel
      .find({ expiredAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .limit(5);

    responseSuccess(
      response,
      result.map((item: any) => ({
        ...item.toJSON(),
        image: `${constants.URL_IMAGE_BANNER}/${item.toJSON().image}`,
      })),
    );
  };

  private create = async (request: any, response: Response) => {
    const url: string = request.body.url;
    const title: string = request.body.title;
    const name = request.files.image.name.substring(
      request.files.image.name.lastIndexOf('.'),
      request.files.image.name.length,
    );
    const pathFile = `${replaceAll(title, ' ', '-')}${name}`;
    fs.writeFileSync(`public/image-banners/${pathFile}`, request.files.image.data);
    const createBanner = new this.newModel({
      url,
      image: pathFile,
      author: request.user._id,
      title,
    });
    const saveBanner = await createBanner.save();
    responseSuccess(response, saveBanner);
  };

  private deleteBanner = async (request: any, response: Response) => {
    const id = request.params.id;
    await this.newModel.updateOne(
      {
        _id: id,
      },
      { expiredAt: new Date() },
    );
    responseSuccess(response, {});
  };
}

export default ExtraRuneController;
