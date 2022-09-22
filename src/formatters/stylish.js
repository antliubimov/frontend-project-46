import isObject from '../utils.js';

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
        case 'removed':
          result = getString(key, value, depth, '-');
          break;
        case 'updated':
          result = `${getString(key, value[0], depth, '-')}\n${getString(
            key,
            value[1],
            depth,
            '+'
          )}`;
          break;
        default:
          result = getString(key, value, depth);
          break;
      }
      return result;
    });

  const result = iter(data, 1).flat(Infinity);
  return `{\n${result.join('\n')}\n}`;
};

export default stylish;
