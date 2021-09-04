import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import PostController from './post/post.controller';
import ReportController from './report/report.controller';
import UserController from './user/user.controller';
import ChampionController from './champion/champion.controller';
import ItemController from './item/item.controller';
import SummonerController from './summoner/summoner.controller';
import GuideController from './guide/guide.controller';
import MainRuneController from './mainRune/mainRune.controller';
import runeDetailController from './runeDetail/runeDetail.controller';
import extraRuneController from './extraRune/controller';
import extraRuneDetailController from './extraRuneDetail/controller';
import garenaController from './garena/garena.controller';
import commonController from './common/common.controller';
import bannerController from './banner/controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
    new ReportController(),
    new ChampionController(),
    new ItemController(),
    new SummonerController(),
    new GuideController(),
    new MainRuneController(),
    new runeDetailController(),
    new extraRuneController(),
    new extraRuneDetailController(),
    new garenaController(),
    new commonController(),
    new bannerController(),
  ],
);

app.listen();
