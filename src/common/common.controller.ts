import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import * as fs from 'fs';
import * as constants from '../utils/constant';
import itemModel from '../item/item.model';
import championModel from '../champion/champion.model';
import summonerModel from '../summoner/summoner.model';
import mainRuneModel from '../mainRune/mainRune.model';
import extraRuneModel from '../extraRune/model';
import guideModel from '../guide/guide.model';
import bannerModel from '../banner/model';

class HistoryController implements Controller {
  public path = '/common';
  public router = Router();
  private item = itemModel;
  private summoner = summonerModel;
  private champion = championModel;
  private mainRune = mainRuneModel;
  private extraRune = extraRuneModel;
  private guide = guideModel;
  private banner = bannerModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload-image`, this.uploadImage);
    this.router.get(`${this.path}/all-data`, this.getAllData);
    this.router.get(`${this.path}/dashboard`, this.getDashboard);
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
      champions: champions.map(({ key, name, image, spells, id, passive }: any) => ({
        key,
        name,
        image: `${constants.URL_IMAGE_CHAMPION}/${id}_0.jpg`,
        spells: spells.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: `${constants.URL_IMAGE_CHAMPION_SPELL}/${item.image.full}`,
        })),
        passive: {
          id: `${id}P`,
          name: passive.name,
          image: `${constants.URL_IMAGE_CHAMPION_PASSIVE}/${passive.image.full}`
        }
      })),
      mainRunes: mainRunes.map(({ id, key, icon, name, slots, color }: any) => ({
        id,
        key,
        name,
        color,
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
          color: item.color
        })),
      })),
    };
    response.send({
      code: 200,
      data: responseData,
    });
  };

  private getDashboard = async (request: any, response: Response) => {
    const guideViews = await this.guide.aggregate([
      {
        $match: { expiredAt: { $exists: false } },
      },
      {
        $lookup: {
          from: 'champions',
          localField: 'championId',
          foreignField: 'key',
          as: 'champion',
        },
      },
      {
        $unwind: { path: '$champion', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          view: 1,
          items: 1,
          introduce: 1,
          name: 1,
          path: 1,
          champion: {
            id: '$champion.key',
            name: '$champion.name',
            url: {
              $concat: [constants.URL_IMAGE_CHAMPION_SPLASH, '/', '$champion.id', '_0.jpg'],
            },
          },
        },
      },
      { $sort: { view: -1 } },
      { $limit: 6 },
    ]);
    const guideNews = await this.guide.aggregate([
      {
        $match: { expiredAt: { $exists: false } },
      },
      {
        $lookup: {
          from: 'champions',
          localField: 'championId',
          foreignField: 'key',
          as: 'champion',
        },
      },
      {
        $unwind: { path: '$champion', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          view: 1,
          items: 1,
          introduce: 1,
          name: 1,
          path: 1,
          champion: {
            id: '$champion.key',
            name: '$champion.name',
            url: {
              $concat: [constants.URL_IMAGE_CHAMPION_SPLASH, '/', '$champion.id', '_0.jpg'],
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 6 },
    ]);

    const banners = await this.banner
      .find({ expiredAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .limit(5);

    const responseData = {
      mostViewList: guideViews.map((item: any) => ({
        ...item,
        items: item.items
          .sort((a: any, b: any) => a.index - b.index)
          .map(({ id }: any) => `${constants.URL_IMAGE_ITEM}/${id}.png`),
      })),
      newestList: guideNews.map((item: any) => ({
        ...item,
        items: item.items
          .sort((a: any, b: any) => a.index - b.index)
          .map(({ id }: any) => `${constants.URL_IMAGE_ITEM}/${id}.png`),
      })),
      metaList: guideViews.map((item: any) => ({
        ...item,
        items: item.items
          .sort((a: any, b: any) => a.index - b.index)
          .map(({ id }: any) => `${constants.URL_IMAGE_ITEM}/${id}.png`),
      })),
      bannerList: banners.map(({ url, image }: any) => ({
        url, image: `${constants.URL_IMAGE_BANNER}/${image}`
      })),
    };

    response.send({
      code: 200,
      data: responseData,
    });
  };
}

export default HistoryController;
