import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import guideModel from '../guide/guide.model';
import * as constants from '../utils/constant';
import axios from 'axios';
import { responseSuccess } from '../utils/helpers';

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
    responseSuccess(response, data.data);
  };

  private getHitories = async (request: Request, response: Response) => {
    const accountId = request.params.accountId;
    const begIndex = request.query.begIndex;
    const endIndex = request.query.endIndex;
    const histories = await axios.get(
      `${constants.urlGarena}/stats/player_history/VN/${accountId}?begIndex=${begIndex}&endIndex=${endIndex}`,
    );
    responseSuccess(response, histories.data);
  };

  private getHitoryId = async (request: Request, response: Response) => {
    const id = request.params.id;
    const history = await axios.get(
      `${constants.urlGarena}/stats/game/VN/${id}?visiblePlatformId=VN`,
    );
    const timeline = await axios.get(
      `${constants.urlGarena}/stats/game/VN/${id}/timeline`,
    );
    responseSuccess(response, {
      ...history.data,
      timeline: timeline.data
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
      responseSuccess(response, histories.data);
    } catch (err) {
      responseSuccess(response, {});
    }
  };
}

export default HistoryController;
