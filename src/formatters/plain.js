import _ from 'lodash';

const getValue = (value) => {
  let result = value;
  if (_.isObject(value)) {
    result = '[complex value]';
  } else if (_.isString(value)) {
    result = `'${value}'`;
  }
  return result;
};

const plain = (data) => {
  const iter = (node, parentKey = '') => node.flatMap(({ type, key, value }) => {
    const newParentKey = parentKey ? `${parentKey}.${key}` : `${key}`;
    switch (type) {
      case 'nested':
        return iter(value, newParentKey);
      case 'added':
        return `Property '${newParentKey}' was added with value: ${getValue(value)}`;
      case 'updated':
        return `Property '${newParentKey}' was updated. From ${getValue(value[0])} to ${getValue(value[1])}`;
      case 'removed':
        return `Property '${newParentKey}' was removed`;
      default:
        return null;
    }
  });

  return iter(data)
    .filter((el) => !!el === true)
    .join('\n');
};

export default plain;
