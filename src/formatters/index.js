import stylish from './stylish.js';
import plain from './plain.js';

export default (tree, formatName) => {
  let result = '';
  switch (formatName) {
    case 'stylish':
      result = stylish(tree);
      break;
    case 'plain':
      result = plain(tree);
      break;
    default:
      throw new Error(`This ${formatName} formatter is not supported`);
  }
  return result;
};
