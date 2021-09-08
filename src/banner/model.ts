import * as mongoose from 'mongoose';
import IT from './interface';

const schema = new mongoose.Schema(
  {
    version: {
      type: String,
      default: '11.16.1',
    },
    title: String,
    content: String,
    image: String,
    url: String,
    author: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    expiredAt: Date,
  },
  { timestamps: true },
);

const model = mongoose.model<IT & mongoose.Document>('Banner', schema);

export default model;
