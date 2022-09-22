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
      switch (type) {
        case 'nested':
          return [
            `${makeReplaces(depth)}  ${key}: {`,
            iter(value, depth + 1),
            `${makeReplaces(depth)}  }`,
          ];
        case 'added':
          return getString(key, value, depth, '+');
        case 'removed':
          return getString(key, value, depth, '-');
        case 'updated':
          return `${getString(key, value[0], depth, '-')}
${getString(key, value[1], depth, '+')}`;
        default:
          return getString(key, value, depth);
      }
    });
  const result = iter(data, 1).flat(Infinity);
  return `{\n${result.join('\n')}\n}`;
};

export default stylish;
