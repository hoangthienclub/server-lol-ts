import * as mongoose from 'mongoose';
import MainRune from './mainRune.interface';

const mainRuneSchema = new mongoose.Schema({
  version: {
    type: String,
    default: '11.16.1'
  },
  id: Number,
  key: String,
  icon: String,
  name: String,
  slots: Object
});

const mainRuneModel = mongoose.model<MainRune & mongoose.Document>('Mainrune', mainRuneSchema);

export default mainRuneModel;