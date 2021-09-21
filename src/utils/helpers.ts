import * as constants from './constant';
import * as fs from 'fs';
const cryptoJS = require('crypto-js');
// crypto module

export const encrypt = (data: any) => {
  const initVector = '2s_dnH5G4Cq+b_3?';
  const ciphertext = cryptoJS.AES.encrypt(JSON.stringify(data), initVector).toString();
  return ciphertext
};

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
  try {
    getAllIndexes(data, `${constants.URL_SERVER}/temp-files/`)
      .map((i: any) => data.substr(i + 39, 17))
      .map((i: any) => {
        fs.renameSync(`public/temp-files/${i}`, `public/image-guides/${i}`);
        return i;
      });
    return replaceAll(data, 'temp-files', 'image-guides');
  } catch (err) {
    console.log('prepareData: ', prepareData);
    return data;
  }
};

export const responseSuccess = (response: any, data: any) => {
  response.send({
    code: 200,
    data: encrypt(data),
  });
};

export const responseError = (response: any, data: any) => {
  response.send({
    code: 500,
    data
  });
};
