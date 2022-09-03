import { cwd } from 'node:process';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const readFile = (filePath) => {
  const currDir = cwd();
  const fileOfPath = path.resolve(currDir, filePath);
  return readFileSync(fileOfPath);
}

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

const genDiff = (file1, file2) => {
  const extname1 = getExtName(file1);
  const extname2 = getExtName(file2);
  let file1Contents = getFileContents(file1);





}

console.log(genDiff('/assets/file1.json', '../assets/file2.json'));