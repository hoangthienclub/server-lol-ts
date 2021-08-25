import * as mongoose from 'mongoose';
import Item from './item.interface';

const itemSchema = new mongoose.Schema({
  version: String,
  id: String,
  name: String,
  description: String,
  colloq: String,
  plaintext: String,
  into: Object,
  from: Object,
  image: Object,
  gold: Object,
  tags: Object,
  maps: Object,
  stats: Object,
  depth: Number,

  effect: Object,
  stacks: Number,
  consumed: Boolean,
  inStore: Boolean,
  hideFromAll: Boolean,
  consumeOnFull: Boolean,
  specialRecipe: Number,

  requiredChampion: String
});

const itemModel = mongoose.model<Item & mongoose.Document>('Item', itemSchema);

export default itemModel;
