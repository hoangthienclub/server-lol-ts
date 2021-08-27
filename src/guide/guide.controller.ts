import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
// import authMiddleware from '../middleware/auth.middleware';
import Champion from './summoner.interface';
import guideModel from './guide.model';
import {
  URL_IMAGE_SUMMONER,
  URL_IMAGE_ITEM,
  URL_IMAGE_RUNE,
  URL_IMAGE_EXTRA_RUNE,
} from '../utils/constant';

class GuideController implements Controller {
  public path = '/guides';
  public router = Router();
  private guide = guideModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllGuides);
    this.router.post(this.path, this.createGuide);
    this.router.get(`${this.path}/:path`, this.getByPath);
  }

  private getAllGuides = async (request: Request, response: Response) => {
    const result = await this.guide.aggregate([
      {
        $lookup: {
          from: 'champions',
          localField: 'championId',
          foreignField: 'key',
          as: 'champion',
        },
      },
      {
        $unwind: '$champion',
      },
      {
        $project: {
          _id: 1,
          view: 1,
          name: 1,
          path: 1,
          champion: {
            id: '$champion.key',
            name: '$champion.name',
          },
        },
      },
    ]);
    response.send({
      code: 200,
      data: result,
    });
  };

  private getByPath = async (request: Request, response: Response) => {
    const path = request.params.path;
    const result = await this.guide.aggregate([
      {
        $match: { path },
      },
      {
        $unwind: '$summoners',
      },
      {
        $lookup: {
          from: 'summoners',
          localField: 'summoners.data',
          foreignField: 'key',
          as: 'summoners.data',
        },
      },
      {
        $group: {
          _id: {
            view: '$view',
            name: '$name',
            path: '$path',
            championId: '$championId',
            items: '$items',
            runes: '$runes',
            position: '$position',
            introduce: '$introduce',
            play: '$play',
            videos: '$videos',
          },
          summoners: {
            $push: '$summoners',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          name: '$_id.name',
          path: '$_id.path',
          championId: '$_id.championId',
          items: '$_id.items',
          runes: '$_id.runes',
          position: '$_id.position',
          introduce: '$_id.introduce',
          play: '$_id.play',
          videos: '$_id.videos',
          summoners: '$summoners',
        },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'items',
          localField: 'items.data',
          foreignField: 'id',
          as: 'items.data',
        },
      },
      {
        $group: {
          _id: {
            view: '$view',
            name: '$name',
            path: '$path',
            championId: '$championId',
            summoners: '$summoners',
            runes: '$runes',
            position: '$position',
            introduce: '$introduce',
            play: '$play',
            videos: '$videos',
          },
          items: {
            $push: '$items',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          name: '$_id.name',
          path: '$_id.path',
          championId: '$_id.championId',
          summoners: '$_id.summoners',
          runes: '$_id.runes',
          position: '$_id.position',
          introduce: '$_id.introduce',
          play: '$_id.play',
          videos: '$_id.videos',
          items: '$items',
        },
      },
      {
        $unwind: '$runes',
      },
      {
        $lookup: {
          from: 'mainrunes',
          localField: 'runes.primary.id',
          foreignField: 'id',
          as: 'runes.primary.id',
        },
      },
      {
        $lookup: {
          from: 'mainrunes',
          localField: 'runes.sub1.id',
          foreignField: 'id',
          as: 'runes.sub1.id',
        },
      },
      { $unwind: '$runes.primary.id' },
      { $unwind: '$runes.sub1.id' },
      {
        $project: {
          view: 1,
          name: 1,
          path: 1,
          championId: 1,
          summoners: 1,
          position: 1,
          introduce: 1,
          play: 1,
          videos: 1,
          items: 1,
          runes: {
            index: 1,
            primary: {
              id: '$runes.primary.id.id',
              name: '$runes.primary.id.name',
              image: {
                $concat: [URL_IMAGE_RUNE, '/', '$runes.primary.id.icon'],
              },
              data: '$runes.primary.data',
            },
            sub1: {
              id: '$runes.sub1.id.id',
              name: '$runes.sub1.id.name',
              image: {
                $concat: [URL_IMAGE_RUNE, '/', '$runes.sub1.id.icon'],
              },
              data: '$runes.sub1.data',
            },
            sub2: {
              data: '$runes.sub2.data',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'runedetails',
          localField: 'runes.primary.data',
          foreignField: 'id',
          as: 'runes.primary.data',
        },
      },
      {
        $lookup: {
          from: 'runedetails',
          localField: 'runes.sub1.data',
          foreignField: 'id',
          as: 'runes.sub1.data',
        },
      },
      {
        $lookup: {
          from: 'extrarunedetails',
          localField: 'runes.sub2.data',
          foreignField: 'id',
          as: 'runes.sub2.data',
        },
      },
      {
        $group: {
          _id: {
            view: '$view',
            name: '$name',
            path: '$path',
            championId: '$championId',
            summoners: '$summoners',
            items: '$items',
            position: '$position',
            introduce: '$introduce',
            play: '$play',
            videos: '$videos',
          },
          runes: {
            $push: '$runes',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          name: '$_id.name',
          path: '$_id.path',
          championId: '$_id.championId',
          summoners: '$_id.summoners',
          items: '$_id.items',
          position: '$_id.position',
          introduce: '$_id.introduce',
          play: '$_id.play',
          videos: '$_id.videos',
          runes: '$runes',
        },
      },
    ]);
    const responseData: any = result.map((item: any) => ({
      ...item,
      summoners: item.summoners.map(({ data, index }: any) => ({
        index,
        data: data.map(({ id, name, description, image }: any) => ({
          name,
          description,
          image: `${URL_IMAGE_SUMMONER}/${image.full}`,
        })),
      })),
      items: item.items.map(({ data, index }: any) => ({
        index,
        data: data.map(({ id, name, description, image }: any) => ({
          name,
          description,
          image: `${URL_IMAGE_ITEM}/${image.full}`,
        })),
      })),
      runes: item.runes.map(({ index, primary, sub1, sub2 }: any) => ({
        index,
        primary: {
          id: primary.id,
          name: primary.name,
          image: primary.image,
          data: primary.data.map(({ id, name, icon }: any) => ({
            id,
            name,
            image: `${URL_IMAGE_RUNE}/${icon}`,
          })),
        },
        sub1: {
          id: sub1.id,
          name: sub1.name,
          image: sub1.image,
          data: primary.data.map(({ id, name, icon }: any) => ({
            id,
            name,
            image: `${URL_IMAGE_RUNE}/${icon}`,
          })),
        },
        sub2: {
          data: sub2.data.map(({ id, name }: any) => ({
            id,
            name,
            image: `${URL_IMAGE_EXTRA_RUNE}/${id}.png`,
          })),
        },
      })),
    }));
    response.send({
      code: 200,
      data: responseData,
    });
  };

  private createGuide = async (request: any, response: Response) => {
    const data: any = request.body;
    const createGuide = new this.guide(data);
    const saveGuide = await createGuide.save();
    response.send({
      code: 200,
      data: saveGuide,
    });
  };
}

export default GuideController;
