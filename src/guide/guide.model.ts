import * as mongoose from 'mongoose';
import Champion from './summoner.interface';

const guideSchema = new mongoose.Schema({
  championId: Number,
  items: Object,
  skills: Object,
  summners: Object,
  runes: Object,
  position: Number,
  content: String,
});

const guideModel = mongoose.model<Champion & mongoose.Document>('Guide', guideSchema);

export default guideModel;

// guide
// {
// 	championId: 11,
// 	items: [
// 		{
// 			index: 1,
// 			data: [1,2,3,4,5,6]
// 		}
// 	],
// 	skills: [
// 		{
// 			index: 1,
// 			data: [1, 1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1]
// 		}
// 	],
// 	summoners: [
// 		{
// 			index: 1,
// 			data: [1, 2]
// 		}
// 	],
// 	runes: [
// 		{
// 			index: 1,
// 			data1: [1, 2, 3, 4, 5],
// 			data2: [1, 2, 3],
// 			data3: [1, 2, 3],
// 		}
// 	],
// 	position: 1, //1: top, 2: mid, 3: ad, 4: support, 5: jungle
// 	content: ""
// }