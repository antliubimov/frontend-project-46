import { cwd } from 'node:process';
import path from 'node:path';
import { readFileSync } from 'node:fs';




const readFile = (filePath) => {
  const currDir = cwd();
  return readFileSync(path.resolve(currDir, filePath));
}

const getExtName = (file) => path.extname(file);

const genDiff = (file1, file2) => {
  const extname1 = getExtName(file1);
  const extname2 = getExtName(file2);


  // let student = JSON.parse(rawd);


  return extname1;
}

console.log(genDiff('../assets/file1.json', '../assets/file2.json'));