import * as constants from './constant';
import * as fs from 'fs';

export const getAllIndexes = (arr: any, val: string) => {
  const indexes: any = [];
  let i: number = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
};
export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export const replaceAll = (str: string, find: string, replace: string) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const prepareData = (data: string) => {
  getAllIndexes(data, `${constants.URL_SERVER}/temp-files/`)
    .map((i: any) => data.substr(i + 39, 17))
    .map((i: any) => {
      fs.renameSync(`public/temp-files/${i}`, `public/image-guides/${i}`);
      return i;
    });
  return replaceAll(data, 'temp-files', 'image-guides');
};
