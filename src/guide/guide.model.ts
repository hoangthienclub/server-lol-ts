import * as mongoose from 'mongoose';
import Champion from './summoner.interface';

const guideSchema = new mongoose.Schema({
  version: {
    type: String,
    default: '11.16.1'
  },
  championId: Number,
  name: String,
  path: String,
  items: Object,
  summoners: Object,
  runes: Object,
  position: Number,
  skills: Object,
  introduce: String,
  play: Object,
  videos: Object,
});

const guideModel = mongoose.model<Champion & mongoose.Document>('Guide', guideSchema);

export default guideModel;
