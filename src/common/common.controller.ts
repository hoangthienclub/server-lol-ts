import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import * as fs from 'fs';
import * as constants from '../utils/constant';

class HistoryController implements Controller {
  public path = '/common';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload-image`, this.uploadImage);
  }

  private uploadImage = async (request: any, response: Response) => {
    const name = request.files.image.name.substring(request.files.image.name.lastIndexOf('.'), request.files.image.name.length);
    const pathFile = `${new Date().getTime()}${name}`;
    fs.writeFileSync(`public/temp-files/${pathFile}`, request.files.image.data);
    response.send({
      code: 200,
      data: `${constants.URL_SERVER}/temp-files/${pathFile}`
    });
  };
}

export default HistoryController;
