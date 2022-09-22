import yaml from 'js-yaml';

const parseFn = (extname) => {
  switch (extname) {
    case ('.json'):
      return JSON.parse;
    case ('.yml'):
    case ('.yaml'):
      return yaml.load;
    default:
      throw new Error(`The format ${extname} is not supported`);
  }
};

export default parseFn;
