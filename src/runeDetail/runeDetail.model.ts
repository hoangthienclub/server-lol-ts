import * as mongoose from 'mongoose';
import Champion from './runeDetail.interface';

const schema = new mongoose.Schema({
  version: {
    type: String,
    default: '11.16.1'
  },
  id: Number,
  key: String,
  icon: String,
  name: String,
  shortDesc: String,
  longDesc: String
});

const model = mongoose.model<Champion & mongoose.Document>('RuneDetail', schema);

export default model;