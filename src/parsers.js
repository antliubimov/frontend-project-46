import yaml from 'js-yaml';

const parseFn = (extname) => {
  let parse;
  if (extname === '.json') {
    parse = JSON.parse;
  } else if (extname === '.yml' || extname === '.yaml') {
    parse = yaml.load;
  } else {
    throw new Error(`The format ${extname} is not supported`);
  }
  return parse;
};

export default parseFn;
