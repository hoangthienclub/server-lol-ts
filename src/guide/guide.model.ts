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
    extraItem: String,
    summoners: Object,
    extraSummoner: String,
    runePrimary: Object,
    runeSub1: Object,
    runeSub2: Object,
    position: Number,
    skills: Object,
    introduce: String,
    guide: Object,
    videos: Object,
    championCounters: Object,
    view: {
      type: Number,
      default: 0,
    },
    author: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    expiredAt: Date,
    seoTitle: String,
    seoDesc: String,
    seoImageUrl: String,
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const guideModel = mongoose.model<Champion & mongoose.Document>('Guide', guideSchema);

export default guideModel;
