import { cwd } from 'node:process';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseFn from './parsers.js';
import isObject from './utils.js';
import formatter from './formatters/index.js';

const readFile = (filePath) => {
  const currDir = cwd();
  const fileOfPath = path.resolve(currDir, filePath);
  return readFileSync(fileOfPath, 'utf-8');
};

const getExtName = (filePath) => path.extname(filePath);

const getFileContent = (file, extname) => {
  try {
    const parse = parseFn(extname);
    return parse(readFile(file));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`File ${file} not found!`);
    } else {
      throw err;
    }
  }
  return null;
};

const getSortedUnionKeys = (obj1, obj2) => {
  const obj1Keys = _.keys(obj1);
  const obj2Keys = _.keys(obj2);
  return _.sortBy(_.union(obj1Keys, obj2Keys));
};

const diffObjects = (obj1, obj2) => {
  const allSortedKeys = getSortedUnionKeys(obj1, obj2);

  return allSortedKeys.map((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return {
        type: 'nested',
        key,
        value: diffObjects(obj1[key], obj2[key]),
      };
    }
    if (!_.has(obj1, key)) {
      return {
        type: 'added',
        key,
        value: obj2[key],
      };
    }
    if (!_.has(obj2, key)) {
      return {
        type: 'removed',
        key,
        value: obj1[key],
      };
    }
    if (!_.isEqual(obj1[key], obj2[key])) {
      return {
        type: 'updated',
        key,
        value: [obj1[key], obj2[key]],
      };
    }
    return {
      type: 'unchanged',
      key,
      value: obj1[key],
    };
  });
};

const genDiff = (file1, file2, formatName = 'stylish') => {
  const extname1 = getExtName(file1);
  const extname2 = getExtName(file2);
  const file1Content = getFileContent(file1, extname1);
  const file2Content = getFileContent(file2, extname2);
  if (file1Content && file2Content) {
    const tree = diffObjects(file1Content, file2Content);
    return formatter(tree, formatName);
  }
  return 'One of the files is empty';
};

export default genDiff;
