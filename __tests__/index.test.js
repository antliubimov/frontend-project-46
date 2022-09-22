import { test, expect } from '@jest/globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf8');

const cases = [
  ['file1.json', 'file2.json', 'expected_json.txt'],
  ['file1.yaml', 'file2.yaml', 'expected_yaml.txt'],
  ['file1.yml', 'file2.yml', 'expected_yaml.txt'],
];

const plainCases = [
  ['file1.json', 'file2.json', 'expected_plain.txt'],
  ['file1.yaml', 'file2.yaml', 'expected_plain.txt'],
  ['file1.yml', 'file2.yml', 'expected_plain.txt'],
];

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

test.each(plainCases)(
  'Compare %s and %s files with plain formatter',
  (fileName1, fileName2, expectedFileName) => {
    const expectedResult = readFile(expectedFileName);
    const file1Path = getFixturePath(fileName1);
    const file2Path = getFixturePath(fileName2);
    const result = genDiff(file1Path, file2Path, 'plain');
    expect(result).toEqual(expectedResult);
  }
);

test('Different extnames', () => {
  expect(genDiff('file1.json', 'file2.yaml')).toEqual('Extnames are not equal');
});

test('One of the files is empty', () => {
  expect(genDiff('file1.json', 'empty.json')).toEqual(
    'One of the files is empty'
  );
});

test('The format is not supported', () => {
  expect(() => genDiff('file1.json', 'expected_json.txt')).toThrowError(
    `The format .txt is not supported`
  );
});

// test('The formatter is not supported', () => {
//   expect(() => genDiff('file1.json', 'file2.json', 'test')).toThrowError(
//     `This test formatter is not supported`
//   );
// });
