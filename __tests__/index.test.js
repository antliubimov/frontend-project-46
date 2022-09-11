import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';
import { test, expect } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf8');

const cases = [['file1.json', 'file2.json', 'expected_flat_json.txt']];

test.each(cases)(
  'Compare %s and %s files',
  (fileName1, fileName2, expectedFileName) => {
    const expectedResult = readFile(expectedFileName);
    const file1Path = getFixturePath(fileName1);
    const file2Path = getFixturePath(fileName2);
    const result = genDiff(file1Path, file2Path);
    expect(result).toEqual(expectedResult);
  }
);
