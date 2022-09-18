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
  const iter = (node, parentKey = '') =>
    node.flatMap(({ type, key, value }) => {
      let result = '';
      const newParentKey = parentKey ? `${parentKey}.${key}` : `${key}`;
      switch (type) {
        case 'nested':
          result = iter(value, newParentKey);
          break;

        case 'added':
          result = `Property '${newParentKey}' was added with value: ${getValue(
            value
          )}`;
          break;
        case 'updated':
          result = `Property '${newParentKey}' was updated. From ${getValue(
            value[0]
          )} to ${getValue(value[1])}`;
          break;
        case 'removed':
          result = `Property '${newParentKey}' was removed`;
          break;
        default:
          result = null;
          break;
      }
      return result;
    });

  return iter(data)
    .filter((el) => !!el === true)
    .join('\n');
};

export default plain;
