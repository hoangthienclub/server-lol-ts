import * as mongoose from 'mongoose';
import Champion from './summoner.interface';

const summonerSchema = new mongoose.Schema({
  version: String,
  id: String,
  name: String,
  description: String,
  tooltip: String,
  maxrank: Number,
  cooldown: Object,
  cooldownBurn: String,
  cost: Object,
  costBurn: String,
  datavalues: Object,
  effect: Object,
  effectBurn: Object,
  vars: Object,
  key: Number,
  summonerLevel: Number,
  modes: Object,
  costType: String,
  maxammo: String,
  range: Object,
  rangeBurn: String,
  image: Object,
  resource: String
});

const summonerModel = mongoose.model<Champion & mongoose.Document>('Summoner', summonerSchema);

export default summonerModel;
