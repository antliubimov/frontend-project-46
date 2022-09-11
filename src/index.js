import { cwd } from 'node:process';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';

const readFile = (filePath) => {
  const currDir = cwd();
  const fileOfPath = path.resolve(currDir, filePath);
  return readFileSync(fileOfPath, 'utf-8');
};

const getExtName = (filePath) => path.extname(filePath);

const getFileContents = (file) => {
  let fileContents = '';
  try {
    fileContents = JSON.parse(readFile(file));
  } catch (err) {
    if (err.code === 'ENOENT') {
      fileContents = null;
      console.log(`File ${file} not found!`);
    } else {
      throw err;
    }
  }
  return fileContents;
};

const getSortedUnionKeys = (obj1, obj2) => {
  const obj1Keys = _.keys(obj1);
  const obj2Keys = _.keys(obj2);
  return _.sortedUniq([...obj1Keys, ...obj2Keys].sort());
};

const diffJSON = (obj1, obj2) => {
  const allSortedKeys = getSortedUnionKeys(obj1, obj2);
  const result = allSortedKeys.reduce((acc, key) => {
    let str = acc;
    if (
      Object.hasOwn(obj1, key) &&
      Object.hasOwn(obj2, key) &&
      obj1[key] === obj2[key]
    ) {
      str += `   ${key}: ${obj1[key]}\n`;
    } else if (
      Object.hasOwn(obj1, key) &&
      Object.hasOwn(obj2, key) &&
      obj1[key] !== obj2[key]
    ) {
      str += ` - ${key}: ${obj1[key]}\n + ${key}: ${obj2[key]}\n`;
    } else if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
      str += ` - ${key}: ${obj1[key]}\n`;
    } else if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
      str += ` + ${key}: ${obj2[key]}\n`;
    }
    return str;
  }, `\n`);

  return `{${result}}`;
};

const genDiff = (file1, file2) => {
  const extname1 = getExtName(file1);
  const extname2 = getExtName(file2);
  const file1Contents = getFileContents(file1);
  const file2Contents = getFileContents(file2);
  let result = '';
  if (extname1 === extname2 && file1Contents && file2Contents) {
    result = diffJSON(file1Contents, file2Contents);
  } else if (extname1 !== extname2) {
    result = 'Extnames are not equal.';
  } else {
    result = 'One of files is empty';
  }
  return result;
};

export default genDiff;
