import * as mongoose from 'mongoose';
import Champion from './champion.interface';

const championSchema = new mongoose.Schema({
  version: String,
  id: String,
  key: Number,
  name: String,
  title: String,
  blurb: String,
  info: Object,
  image: Object,
  tags: Object,
  partype: String,
  stats: Object,
  allytips: Object,
  enemytips: Object,
  lore: String,
  passive: Object,
  recommended: Object,
  skins: Object,
  spells: Object,

  thumbnail: String,
});

const championModel = mongoose.model<Champion & mongoose.Document>('Champion', championSchema);

export default championModel;
