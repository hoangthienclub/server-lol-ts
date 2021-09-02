import * as mongoose from 'mongoose';
import Champion from './summoner.interface';

const guideSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      default: '11.16.1',
    },
    championId: Number,
    name: String,
    path: {
      type: String,
      unique: true,
    },
    items: Object,
    summoners: Object,
    runes: Object,
    position: Number,
    skills: Object,
    introduce: String,
    guide: Object,
    videos: Object,
    championCouters: Object,
    view: {
      type: Number,
      default: 0,
    },
    author: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    expiredAt: Date,
  },
  { timestamps: true },
);

const guideModel = mongoose.model<Champion & mongoose.Document>('Guide', guideSchema);

export default guideModel;
