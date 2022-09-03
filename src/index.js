import { cwd } from "node:process";
import path from "node:path";
import { readFileSync } from "node:fs";
import _ from "lodash";

const readFile = (filePath) => {
  const currDir = cwd();
  const fileOfPath = path.resolve(currDir, filePath);
  return readFileSync(fileOfPath);
};

const getExtName = (filePath) => path.extname(filePath);

const getFileContents = (file) => {
  let fileContents = "";
  try {
    fileContents = JSON.parse(readFile(file));
  } catch (err) {
    if (err.code === "ENOENT") {
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
  let result = `\n`;
  for (const key of allSortedKeys) {
    if (
      Object.hasOwn(obj1, key) &&
      Object.hasOwn(obj2, key) &&
      obj1[key] === obj2[key]
    ) {
      result = `${result}   ${key}: ${obj1[key]}\n`;
    } else if (
      Object.hasOwn(obj1, key) &&
      Object.hasOwn(obj2, key) &&
      obj1[key] !== obj2[key]
    ) {
      result = `${result} - ${key}: ${obj1[key]}\n`;
      result = `${result} + ${key}: ${obj2[key]}\n`;
    } else if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
      result = `${result} - ${key}: ${obj1[key]}\n`;
    } else if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
      result = `${result} + ${key}: ${obj2[key]}\n`;
    }
  }
  return `{${result}}`;
};

const genDiff = (file1, file2) => {
  const extname1 = getExtName(file1);
  const extname2 = getExtName(file2);
  let file1Contents = getFileContents(file1);
  let file2Contents = getFileContents(file2);
  if (extname1 === extname2 && file1Contents && file2Contents) {
    return diffJSON(file1Contents, file2Contents);
  } else if (extname1 !== extname2) {
    return "Extnames are not equal.";
  } else {
    return "One of files is empty";
  }
};

export default genDiff;
