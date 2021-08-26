import * as mongoose from 'mongoose';
import IT from './interface';

const schema = new mongoose.Schema({
  version: {
    type: String,
    default: '11.16.1'
  },
  id: Number,
  name: String,
});

const model = mongoose.model<IT & mongoose.Document>('ExtraRuneDetail', schema);

export default model;