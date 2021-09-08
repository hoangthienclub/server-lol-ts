import { Request, Response, NextFunction, Router } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import Champion from './summoner.interface';
import guideModel from './guide.model';
import * as constants from '../utils/constant';
import { prepareData } from '../utils/helpers';

class GuideController implements Controller {
  public path = '/guides';
  public adminPath = '/admin-guides';
  public router = Router();
  private guide = guideModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.adminPath, authMiddleware, this.createGuide);
    this.router.delete(`${this.adminPath}/:id`, authMiddleware, this.deleteGuide);
    this.router.put(`${this.adminPath}/:id`, authMiddleware, this.updateGuide);
    this.router.get(this.adminPath, authMiddleware, this.getAllGuidesByAdmin);
    this.router.get(`${this.adminPath}/detail/:id`, this.getById);

    this.router.get(this.path, this.getAllGuides);
    this.router.get(`${this.path}/:path`, this.getByPath);
    this.router.get(`${this.path}/list/all-paths`, this.getAllPath);
  }

  private getAllGuidesByAdmin = async (request: Request, response: Response) => {
    const { limit = 10, page = 1, search = '' } = request.query;

    const offset = +limit * +page - +limit;

    const result = await this.guide.aggregate([
      {
        $match: { expiredAt: { $exists: false }, name: { $regex: search, $options: 'i' } },
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
          public: 1,
          champion: {
            id: '$champion.key',
            name: '$champion.name',
            url: {
              $concat: [constants.URL_IMAGE_CHAMPION_SPLASH, '/', '$champion.id', '_0.jpg'],
            },
          },
        },
      },
      { $limit: +limit + offset },
      { $skip: offset },
    ]);
    const responseData = result.map((item: any) => ({
      ...item,
      items: item.items
        .sort((a: any, b: any) => a.index - b.index)
        .map(({ id }: any) => `${constants.URL_IMAGE_ITEM}/${id}.png`),
    }));
    response.send({
      code: 200,
      data: {
        totalItems: await this.guide.count({
          expiredAt: { $exists: false },
          name: { $regex: search, $options: 'i' },
        }),
        data: responseData,
      },
    });
  };

  private getAllGuides = async (request: Request, response: Response) => {
    const { limit = 10, page = 1, search = '' } = request.query;

    const offset = +limit * +page - +limit;

    const result = await this.guide.aggregate([
      {
        $match: {
          expiredAt: { $exists: false },
          name: { $regex: search, $options: 'i' },
          isPublic: true,
        },
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
      { $limit: +limit + offset },
      { $skip: offset },
    ]);
    const responseData = result.map((item: any) => ({
      ...item,
      items: item.items
        .sort((a: any, b: any) => a.index - b.index)
        .map(({ id }: any) => `${constants.URL_IMAGE_ITEM}/${id}.png`),
    }));
    response.send({
      code: 200,
      data: {
        totalItems: await this.guide.count({
          expiredAt: { $exists: false },
          name: { $regex: search, $options: 'i' },
          isPublic: true,
        }),
        data: responseData,
      },
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
          localField: 'summoners.id',
          foreignField: 'key',
          as: 'summoners.data',
        },
      },
      {
        $unwind: '$summoners.data',
      },
      {
        $group: {
          _id: {
            view: '$view',
            skills: '$skills',
            name: '$name',
            extraItem: '$extraItem',
            extraSummoner: '$extraSummoner',
            seoTitle: '$seoTitle',
            seoDesc: '$seoDesc',
            seoImageUrl: '$seoImageUrl',
            championCounters: '$championCounters',
            path: '$path',
            championId: '$championId',
            items: '$items',
            runePrimary: '$runePrimary',
            runeSub1: '$runeSub1',
            runeSub2: '$runeSub2',
            position: '$position',
            introduce: '$introduce',
            guide: '$guide',
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
          skills: '$_id.skills',
          name: '$_id.name',
          extraItem: '$_id.extraItem',
          extraSummoner: '$_id.extraSummoner',
          seoTitle: '$_id.seoTitle',
          seoDesc: '$_id.seoDesc',
          seoImageUrl: '$_id.seoImageUrl',
          championCounters: '$_id.championCounters',
          path: '$_id.path',
          championId: '$_id.championId',
          items: '$_id.items',
          runePrimary: '$_id.runePrimary',
          runeSub1: '$_id.runeSub1',
          runeSub2: '$_id.runeSub2',
          position: '$_id.position',
          introduce: '$_id.introduce',
          guide: '$_id.guide',
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
          localField: 'items.id',
          foreignField: 'id',
          as: 'items.data',
        },
      },
      {
        $unwind: '$items.data',
      },
      {
        $group: {
          _id: {
            view: '$view',
            skills: '$skills',
            name: '$name',
            extraItem: '$extraItem',
            extraSummoner: '$extraSummoner',
            seoTitle: '$seoTitle',
            seoDesc: '$seoDesc',
            seoImageUrl: '$seoImageUrl',
            championCounters: '$championCounters',
            path: '$path',
            championId: '$championId',
            summoners: '$summoners',
            runePrimary: '$runePrimary',
            runeSub1: '$runeSub1',
            runeSub2: '$runeSub2',
            position: '$position',
            introduce: '$introduce',
            guide: '$guide',
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
          skills: '$_id.skills',
          name: '$_id.name',
          extraItem: '$_id.extraItem',
          extraSummoner: '$_id.extraSummoner',
          seoTitle: '$_id.seoTitle',
          seoDesc: '$_id.seoDesc',
          seoImageUrl: '$_id.seoImageUrl',
          championCounters: '$_id.championCounters',
          path: '$_id.path',
          championId: '$_id.championId',
          summoners: '$_id.summoners',
          runePrimary: '$_id.runePrimary',
          runeSub1: '$_id.runeSub1',
          runeSub2: '$_id.runeSub2',
          position: '$_id.position',
          introduce: '$_id.introduce',
          guide: '$_id.guide',
          play: '$_id.play',
          videos: '$_id.videos',
          items: '$items',
        },
      },
      {
        $unwind: '$runePrimary.data',
      },
      {
        $lookup: {
          from: 'mainrunes',
          localField: 'runePrimary.id',
          foreignField: 'id',
          as: 'runePrimary.id',
        },
      },
      {
        $lookup: {
          from: 'runedetails',
          localField: 'runePrimary.data.id',
          foreignField: 'id',
          as: 'runePrimary.data.id',
        },
      },
      {
        $unwind: '$runePrimary.id',
      },
      {
        $unwind: '$runePrimary.data.id',
      },
      {
        $project: {
          _id: 0,
          view: 1,
          skills: 1,
          name: 1,
          extraItem: 1,
          extraSummoner: 1,
          seoTitle: 1,
          seoDesc: 1,
          seoImageUrl: 1,
          championCounters: 1,
          path: 1,
          championId: 1,
          summoners: 1,
          runeSub1: 1,
          runeSub2: 1,
          position: 1,
          introduce: 1,
          guide: 1,
          play: 1,
          videos: 1,
          runePrimary: 1,
          items: 1,
          primary: {
            id: '$runePrimary.id.id',
            name: '$runePrimary.id.name',
            color: '$runePrimary.id.color',
            image: {
              $concat: [constants.URL_IMAGE_RUNE, '/', '$runePrimary.id.icon'],
            },
          },
          primaryData: '$runePrimary.data',
        },
      },
      {
        $group: {
          _id: {
            view: '$view',
            skills: '$skills',
            name: '$name',
            extraItem: '$extraItem',
            extraSummoner: '$extraSummoner',
            seoTitle: '$seoTitle',
            seoDesc: '$seoDesc',
            seoImageUrl: '$seoImageUrl',
            championCounters: '$championCounters',
            items: '$items',
            path: '$path',
            championId: '$championId',
            summoners: '$summoners',
            runeSub1: '$runeSub1',
            runeSub2: '$runeSub2',
            position: '$position',
            introduce: '$introduce',
            guide: '$guide',
            play: '$play',
            videos: '$videos',
            primary: '$primary',
          },
          primaryData: {
            $push: '$primaryData',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          skills: '$_id.skills',
          name: '$_id.name',
          extraItem: '$_id.extraItem',
          extraSummoner: '$_id.extraSummoner',
          seoTitle: '$_id.seoTitle',
          seoDesc: '$_id.seoDesc',
          seoImageUrl: '$_id.seoImageUrl',
          championCounters: '$_id.championCounters',
          items: '$_id.items',
          path: '$_id.path',
          championId: '$_id.championId',
          summoners: '$_id.summoners',
          runeSub1: '$_id.runeSub1',
          runeSub2: '$_id.runeSub2',
          position: '$_id.position',
          introduce: '$_id.introduce',
          guide: '$_id.guide',
          play: '$_id.play',
          videos: '$_id.videos',
          runePrimary: {
            id: '$_id.primary.id',
            name: '$_id.primary.name',
            color: '$_id.primary.color',
            image: '$_id.primary.image',
            data: '$primaryData',
          },
        },
      },
      {
        $unwind: '$runeSub1.data',
      },
      {
        $lookup: {
          from: 'mainrunes',
          localField: 'runeSub1.id',
          foreignField: 'id',
          as: 'runeSub1.id',
        },
      },
      {
        $lookup: {
          from: 'runedetails',
          localField: 'runeSub1.data.id',
          foreignField: 'id',
          as: 'runeSub1.data.id',
        },
      },
      {
        $unwind: '$runeSub1.id',
      },
      {
        $unwind: '$runeSub1.data.id',
      },
      {
        $project: {
          _id: 0,
          view: 1,
          skills: 1,
          items: 1,
          name: 1,
          extraItem: 1,
          extraSummoner: 1,
          seoTitle: 1,
          seoDesc: 1,
          seoImageUrl: 1,
          championCounters: 1,
          path: 1,
          championId: 1,
          summoners: 1,
          runePrimary: 1,
          runeSub2: 1,
          position: 1,
          introduce: 1,
          guide: 1,
          play: 1,
          videos: 1,
          runeSub1: 1,
          sub1: {
            id: '$runeSub1.id.id',
            name: '$runeSub1.id.name',
            color: '$runeSub1.id.color',
            image: {
              $concat: [constants.URL_IMAGE_RUNE, '/', '$runeSub1.id.icon'],
            },
          },
          sub1Data: '$runeSub1.data',
        },
      },
      {
        $group: {
          _id: {
            view: '$view',
            skills: '$skills',
            name: '$name',
            extraItem: '$extraItem',
            extraSummoner: '$extraSummoner',
            seoTitle: '$seoTitle',
            seoDesc: '$seoDesc',
            seoImageUrl: '$seoImageUrl',
            championCounters: '$championCounters',
            items: '$items',
            path: '$path',
            championId: '$championId',
            summoners: '$summoners',
            runePrimary: '$runePrimary',
            runeSub2: '$runeSub2',
            position: '$position',
            introduce: '$introduce',
            guide: '$guide',
            play: '$play',
            videos: '$videos',
            sub1: '$sub1',
          },
          sub1Data: {
            $push: '$sub1Data',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          skills: '$_id.skills',
          name: '$_id.name',
          extraItem: '$_id.extraItem',
          extraSummoner: '$_id.extraSummoner',
          seoTitle: '$_id.seoTitle',
          seoDesc: '$_id.seoDesc',
          seoImageUrl: '$_id.seoImageUrl',
          championCounters: '$_id.championCounters',
          items: '$_id.items',
          path: '$_id.path',
          championId: '$_id.championId',
          summoners: '$_id.summoners',
          runePrimary: '$_id.runePrimary',
          runeSub2: '$_id.runeSub2',
          position: '$_id.position',
          introduce: '$_id.introduce',
          guide: '$_id.guide',
          play: '$_id.play',
          videos: '$_id.videos',
          runeSub1: {
            id: '$_id.sub1.id',
            name: '$_id.sub1.name',
            color: '$_id.sub1.color',
            image: '$_id.sub1.image',
            data: '$sub1Data',
          },
        },
      },
      {
        $unwind: '$runeSub2',
      },
      {
        $lookup: {
          from: 'extrarunedetails',
          localField: 'runeSub2.id',
          foreignField: 'id',
          as: 'runeSub2.id',
        },
      },
      {
        $unwind: '$runeSub2.id',
      },
      {
        $group: {
          _id: {
            view: '$view',
            skills: '$skills',
            name: '$name',
            extraItem: '$extraItem',
            extraSummoner: '$extraSummoner',
            seoTitle: '$seoTitle',
            seoDesc: '$seoDesc',
            seoImageUrl: '$seoImageUrl',
            championCounters: '$championCounters',
            items: '$items',
            path: '$path',
            championId: '$championId',
            summoners: '$summoners',
            runePrimary: '$runePrimary',
            runeSub1: '$runeSub1',
            position: '$position',
            introduce: '$introduce',
            guide: '$guide',
            play: '$play',
            videos: '$videos',
          },
          runeSub2: {
            $push: '$runeSub2',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          skills: '$_id.skills',
          name: '$_id.name',
          extraItem: '$_id.extraItem',
          extraSummoner: '$_id.extraSummoner',
          seoTitle: '$_id.seoTitle',
          seoDesc: '$_id.seoDesc',
          seoImageUrl: '$_id.seoImageUrl',
          championCounters: '$_id.championCounters',
          items: '$_id.items',
          path: '$_id.path',
          championId: '$_id.championId',
          summoners: '$_id.summoners',
          runePrimary: '$_id.runePrimary',
          runeSub1: '$_id.runeSub1',
          position: '$_id.position',
          introduce: '$_id.introduce',
          guide: '$_id.guide',
          play: '$_id.play',
          videos: '$_id.videos',
          runeSub2: '$runeSub2',
        },
      },
      {
        $lookup: {
          from: 'champions',
          localField: 'championId',
          foreignField: 'key',
          as: 'champion',
        },
      },
      { $unwind: '$champion' },
      {
        $project: {
          view: 1,
          skills: 1,
          name: 1,
          extraItem: 1,
          extraSummoner: 1,
          seoTitle: 1,
          seoDesc: 1,
          seoImageUrl: 1,
          championCounters: 1,
          items: 1,
          path: 1,
          summoners: 1,
          position: 1,
          introduce: 1,
          guide: 1,
          play: 1,
          videos: 1,
          runePrimary: 1,
          runeSub1: 1,
          runeSub2: 1,
          champion: {
            id: '$champion.id',
            key: '$champion.key',
            name: '$champion.name',
            tags: '$champion.tags',
            allytips: '$champion.allytips',
            enemytips: '$champion.enemytips',
            lore: '$champion.lore',
            passive: '$champion.passive',
            spells: '$champion.spells',
          },
        },
      },
      {
        $unwind: {
          path: '$championCounters.data',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'champions',
          localField: 'championCounters.data.id',
          foreignField: 'key',
          as: 'championCounters.data.id',
        },
      },
      { $unwind: { path: '$championCounters.data.id', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          view: 1,
          skills: 1,
          name: 1,
          extraItem: 1,
          extraSummoner: 1,
          seoTitle: 1,
          seoDesc: 1,
          seoImageUrl: 1,
          items: 1,
          path: 1,
          summoners: 1,
          position: 1,
          introduce: 1,
          guide: 1,
          play: 1,
          videos: 1,
          runePrimary: 1,
          runeSub1: 1,
          runeSub2: 1,
          champion: 1,
          championCounters: {
            content: '$championCounters.content',
          },
          couterData: {
            id: '$championCounters.data.id.key',
            name: '$championCounters.data.id.name',
            image: {
              $concat: [
                constants.URL_IMAGE_CHAMPION,
                '/',
                '$championCounters.data.id.id',
                '_0.jpg',
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            view: '$view',
            skills: '$skills',
            name: '$name',
            extraItem: '$extraItem',
            extraSummoner: '$extraSummoner',
            seoTitle: '$seoTitle',
            seoDesc: '$seoDesc',
            seoImageUrl: '$seoImageUrl',
            items: '$items',
            path: '$path',
            summoners: '$summoners',
            position: '$position',
            introduce: '$introduce',
            guide: '$guide',
            play: '$play',
            videos: '$videos',
            runePrimary: '$runePrimary',
            runeSub1: '$runeSub1',
            runeSub2: '$runeSub2',
            champion: '$champion',
            championCounters: '$championCounters',
          },
          couterData: {
            $push: '$couterData',
          },
        },
      },
      {
        $project: {
          _id: 0,
          view: '$_id.view',
          skills: '$_id.skills',
          name: '$_id.name',
          extraItem: '$_id.extraItem',
          extraSummoner: '$_id.extraSummoner',
          seoTitle: '$_id.seoTitle',
          seoDesc: '$_id.seoDesc',
          seoImageUrl: '$_id.seoImageUrl',
          items: '$_id.items',
          path: '$_id.path',
          summoners: '$_id.summoners',
          position: '$_id.position',
          introduce: '$_id.introduce',
          guide: '$_id.guide',
          play: '$_id.play',
          videos: '$_id.videos',
          runePrimary: '$_id.runePrimary',
          runeSub1: '$_id.runeSub1',
          runeSub2: '$_id.runeSub2',
          champion: '$_id.champion',
          championCounters: {
            content: '$_id.championCounters.content',
            data: '$couterData',
          },
        },
      },
    ]);
    const responseData: any = result.map((item: any) => ({
      ...item,
      summoners: item.summoners
        .sort((a: any, b: any) => a.index - b.index)
        .map(({ id, data }: any) => ({
          id,
          name: data.name,
          image: `${constants.URL_IMAGE_SUMMONER}/${data.image.full}`,
          description: data.description,
        })),
      items: item.items
        .sort((a: any, b: any) => a.index - b.index)
        .map(({ id, data }: any) => ({
          id,
          name: data.name,
          description: data.plaintext,
          image: `${constants.URL_IMAGE_ITEM}/${data.image.full}`,
        })),
      runePrimary: {
        id: item.runePrimary.id,
        name: item.runePrimary.name,
        color: item.runePrimary.color,
        image: item.runePrimary.image,
        data: item.runePrimary.data
          .sort((a: any, b: any) => a.index - b.index)
          .map(({ id: { id, name, icon } }: any) => ({
            id,
            name,
            image: `${constants.URL_IMAGE_RUNE}/${icon}`,
          })),
      },
      runeSub1: {
        id: item.runeSub1.id,
        name: item.runeSub1.name,
        color: item.runeSub1.color,
        image: item.runeSub1.image,
        data: item.runeSub1.data
          .sort((a: any, b: any) => a.index - b.index)
          .map(({ id: { id, name, icon } }: any) => ({
            id,
            name,
            image: `${constants.URL_IMAGE_RUNE}/${icon}`,
          })),
      },
      runeSub2: item.runeSub2
        .sort((a: any, b: any) => a.index - b.index)
        .map(({ id: { id, name, color } }: any) => ({
          id,
          name,
          color,
          image: `${constants.URL_IMAGE_EXTRA_RUNE}/${id}.png`,
        })),
      champion: {
        ...item.champion,
        image: {
          url: `${constants.URL_IMAGE_CHAMPION_SPLASH}/${item.champion.id}_0.jpg`,
          square: `${constants.URL_IMAGE_CHAMPION_SQUARE}/${item.champion.id}.png`,
        },
        passive: {
          name: item.champion.passive.name,
          description: item.champion.passive.description,
          image: `${constants.URL_IMAGE_CHAMPION_PASSIVE}/${item.champion.passive.image.full}`,
        },
        spells: item.champion.spells.map((spell: any) => ({
          id: spell.id,
          name: spell.name,
          description: spell.description,
          image: `${constants.URL_IMAGE_CHAMPION_SPELL}/${spell.id}.png`,
        })),
      },
    }));
    const responseR = responseData && responseData.length > 0 ? responseData[0] : {};
    try {
      await this.guide.updateOne(
        {
          path,
        },
        { view: responseR.view + 1 },
      );
    } catch (err) {
      console.log('err:', err);
    }
    response.send({
      code: 200,
      data: responseR,
    });
  };

  private createGuide = async (request: any, response: Response) => {
    const data: any = request.body;
    console.log(`createGuide: ${new Date()}, body: ${JSON.stringify(data)}`);
    if (data.guide) {
      data.guide = prepareData(data.guide);
    }
    if (data.introduce) {
      data.introduce = prepareData(data.introduce);
    }
    if (data.extraItem) {
      data.extraItem = prepareData(data.extraItem);
    }
    if (data.extraSummoner) {
      data.extraSummoner = prepareData(data.extraSummoner);
    }
    if (data.championCounters && data.championCounters.content) {
      data.championCounters.content = prepareData(data.championCounters.content);
    }
    const createGuide = new this.guide({
      ...data,
      author: request.user._id,
    });
    const saveGuide = await createGuide.save();
    response.send({
      code: 200,
      data: saveGuide,
    });
  };

  private deleteGuide = async (request: any, response: Response) => {
    const id = request.params.id;
    await this.guide.updateOne(
      {
        _id: id,
      },
      { expiredAt: new Date() },
    );

    response.send({
      code: 200,
      data: {},
    });
  };

  private getById = async (request: any, response: Response) => {
    const id = request.params.id;
    const result = await this.guide.findById(id);

    response.send({
      code: 200,
      data: result,
    });
  };

  private updateGuide = async (request: any, response: Response) => {
    const id = request.params.id;
    const data = request.body;
    console.log(`update: ${new Date()}, body: ${JSON.stringify(data)}`);
    if (data.guide) {
      data.guide = prepareData(data.guide);
    }
    if (data.introduce) {
      data.introduce = prepareData(data.introduce);
    }
    if (data.extraItem) {
      data.extraItem = prepareData(data.extraItem);
    }
    if (data.extraSummoner) {
      data.extraSummoner = prepareData(data.extraSummoner);
    }
    if (data.championCounters && data.championCounters.content) {
      data.championCounters.content = prepareData(data.championCounters.content);
    }
    const result = await this.guide.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });

    response.send({
      code: 200,
      data: result,
    });
  };
  private getAllPath = async (request: Request, response: Response) => {
    const paths = await this.guide
      .find({
        expiredAt: { $exists: false },
        isPublic: true,
      })
      .select('path')
      .sort({ createdAt: -1 });
    response.send({
      code: 200,
      data: paths,
    });
  };
}

export default GuideController;
