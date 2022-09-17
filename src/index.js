import { cwd } from 'node:process';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseFn from './parsers.js';

const readFile = (filePath) => {
  const currDir = cwd();
  const fileOfPath = path.resolve(currDir, filePath);
  return readFileSync(fileOfPath, 'utf-8');
};

const getExtName = (filePath) => path.extname(filePath);

const getFileContent = (file, extname) => {
  let fileContent = '';
  try {
    const parse = parseFn(extname);
    fileContent = parse(readFile(file));
  } catch (err) {
    if (err.code === 'ENOENT') {
      fileContent = null;
      console.log(`File ${file} not found!`);
    } else {
      throw err;
    }
  }
  return fileContent;
};

const getSortedUnionKeys = (obj1, obj2) => {
  const obj1Keys = _.keys(obj1);
  const obj2Keys = _.keys(obj2);
  return _.sortBy(_.union(obj1Keys, obj2Keys));
};

const isObject = (obj) =>
  Object.prototype.toString.call(obj) === '[object Object]';

const diffObjects = (obj1, obj2) => {
  const allSortedKeys = getSortedUnionKeys(obj1, obj2);

  return allSortedKeys.map((key) => {
    let result;
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      result = {
        type: 'nested',
        key,
        value: diffObjects(obj1[key], obj2[key]),
      };
    } else if (!_.has(obj1, key)) {
      result = {
        type: 'added',
        key,
        value: obj2[key],
      };
    } else if (!_.has(obj2, key)) {
      result = {
        type: 'deleted',
        key,
        value: obj1[key],
      };
    } else if (!_.isEqual(obj1[key], obj2[key])) {
      result = {
        type: 'changed',
        key,
        value: [obj1[key], obj2[key]],
      };
    } else {
      result = {
        type: 'unchanged',
        key,
        value: obj1[key],
      };
    }
    return result;
  });
};

const makeReplaces = (depth, replacer = ' ', spacesCount = 2) =>
  `${replacer.repeat(spacesCount * (2 * depth - 1))}`;

const makeString = (data, depth) => {
  if (!isObject(data)) {
    return data;
  }

  const result = Object.entries(data).map(
    ([key, value]) =>
      `${makeReplaces(depth + 1)}  ${key}: ${makeString(value, depth + 1)}`
  );
  return `{\n${result.join('\n')}\n${makeReplaces(depth)}  }`;
};

const getString = (key, value, depth, symbol = ' ') =>
  `${makeReplaces(depth)}${symbol} ${key}: ${makeString(value, depth)}`;

const stylish = (data) => {
  const iter = (node, depth) =>
    node.map(({ type, key, value }) => {
      let result;
      switch (type) {
        case 'nested':
          result = [
            `${makeReplaces(depth)}  ${key}: {`,
            iter(value, depth + 1),
            `${makeReplaces(depth)}  }`,
          ];
          break;
        case 'added':
          result = getString(key, value, depth, '+');
          break;
        case 'deleted':
          result = getString(key, value, depth, '-');
          break;
        case 'changed':
          result = `${getString(key, value[0], depth, '-')}\n${getString(
            key,
            value[1],
            depth,
            '+'
          )}`;
          break;
        case 'unchanged':
          result = getString(key, value, depth);
          break;
        default:
          throw new Error(`This ${type} type is not found`);
      }
      return result;
    });

  const result = iter(data, 1).flat(Infinity);
  return `{\n${result.join('\n')}\n}`;
};

const genDiff = (file1, file2, formatter = 'stylish') => {
  const extname1 = getExtName(file1);
  const extname2 = getExtName(file2);
  const file1Content = getFileContent(file1, extname1);
  const file2Content = getFileContent(file2, extname2);
  let result = '';
  if (extname1 === extname2 && file1Content && file2Content) {
    const tree = diffObjects(file1Content, file2Content);
    if (formatter === 'stylish') {
      result = stylish(tree);
    }
  } else if (extname1 !== extname2) {
    result = 'Extnames are not equal';
  } else {
    result = 'One of the files is empty';
  }
  return result;
};

export default genDiff;
