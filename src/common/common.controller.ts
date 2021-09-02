import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import * as fs from 'fs';
import * as constants from '../utils/constant';
import itemModel from '../item/item.model';
import championModel from '../champion/champion.model';
import summonerModel from '../summoner/summoner.model';
import mainRuneModel from '../mainRune/mainRune.model';
import extraRuneModel from '../extraRune/model';

class HistoryController implements Controller {
  public path = '/common';
  public router = Router();
  private item = itemModel;
  private summoner = summonerModel;
  private champion = championModel;
  private mainRune = mainRuneModel;
  private extraRune = extraRuneModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload-image`, this.uploadImage);
    this.router.get(`${this.path}/all-data`, this.getAllData);
  }

  private uploadImage = async (request: any, response: Response) => {
    const name = request.files.image.name.substring(
      request.files.image.name.lastIndexOf('.'),
      request.files.image.name.length,
    );
    const pathFile = `${new Date().getTime()}${name}`;
    fs.writeFileSync(`public/temp-files/${pathFile}`, request.files.image.data);
    response.send({
      code: 200,
      data: `${constants.URL_SERVER}/temp-files/${pathFile}`,
    });
  };

  private getAllData = async (request: any, response: Response) => {
    const items = await this.item.find();
    const summoners = await this.summoner.find();
    const champions = await this.champion.find();
    const mainRunes = await this.mainRune.find();
    const extraRune = await this.extraRune.find();

    const responseData = {
      items: items.map(({ id, name, image }: any) => ({
        id,
        name,
        image: `${constants.URL_IMAGE_ITEM}/${image.full}`,
      })),
      summoners: summoners.map(({ id, name, image, key }: any) => ({
        id,
        name,
        key,
        image: `${constants.URL_IMAGE_SUMMONER}/${image.full}`,
      })),
      champions: champions.map(({ key, name, image, spells }: any) => ({
        key,
        name,
        image: `${constants.URL_IMAGE_CHAMPION}/${image.full}`,
        spells: spells.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: `${constants.URL_IMAGE_CHAMPION_SPELL}/${item.image.full}`,
        })),
      })),
      mainRunes: mainRunes.map(({ id, key, icon, name, slots }: any) => ({
        id,
        key,
        name,
        icon: `${constants.URL_IMAGE_RUNE}/${icon}`,
        slots: slots.map((slot: any) => ({
          runes: slot.runes.map((item: any) => ({
            id: item.id,
            key: item.key,
            name: item.name,
            icon: `${constants.URL_IMAGE_RUNE}/${item.icon}`,
          })),
        })),
      })),
      extraRune: extraRune.map(({ id, name, options }: any) => ({
        id,
        name,
        options: options.map((item: any) => ({
          id: item.id,
          name: item.name,
          icon: `${constants.URL_IMAGE_EXTRA_RUNE}/${item.id}.png`,
        })),
      })),
    };
    response.send({
      code: 200,
      data: responseData,
    });
  };
}

export default HistoryController;
