import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import guideModel from '../guide/guide.model';
import * as constants from '../utils/constant';
import axios from 'axios';

class HistoryController implements Controller {
  public path = '/garena';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/account`, this.getAccount);
    this.router.get(`${this.path}/histories/:accountId`, this.getHitories);
    this.router.get(`${this.path}/histories`, this.getHitoriesByAccount);
    this.router.get(`${this.path}/history/:id`, this.getHitoryId);
  }

  private getAccount = async (request: Request, response: Response) => {
    const name = request.query.name;
    const data: any = await axios.get(`${constants.urlGarena}/players?name=${name}&region=VN`);
    response.send({
      code: 200,
      data: data.data,
    });
  };

  private getHitories = async (request: Request, response: Response) => {
    const accountId = request.params.accountId;
    const begIndex = request.query.begIndex;
    const endIndex = request.query.endIndex;
    const histories = await axios.get(
      `${constants.urlGarena}/stats/player_history/VN/${accountId}?begIndex=${begIndex}&endIndex=${endIndex}`,
    );
    response.send({
      code: 200,
      data: histories.data,
    });
  };

  private getHitoryId = async (request: Request, response: Response) => {
    const id = request.params.id;
    const history = await axios.get(
      `${constants.urlGarena}/stats/game/VN/${id}?visiblePlatformId=VN`,
    );
    response.send({
      code: 200,
      data: history.data,
    });
  };

  private getHitoriesByAccount = async (request: Request, response: Response) => {
    try {
      const name = request.query.name;
      const account: any = await axios.get(`${constants.urlGarena}/players?name=${name}&region=VN`);
      const accountId = account.data.accountId;
      const begIndex = request.query.begIndex;
      const endIndex = request.query.endIndex;
      const histories = await axios.get(
        `${constants.urlGarena}/stats/player_history/VN/${accountId}?begIndex=${begIndex}&endIndex=${endIndex}`,
      );
      response.send({
        code: 200,
        data: histories.data,
      });
    } catch (err) {
      response.send({
        code: 200,
        data: {},
      });
    }
  };
}

export default HistoryController;
