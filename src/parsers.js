import yaml from 'js-yaml';

const parseFn = (extname) => {
  let parse;
  if (extname === '.json') {
    parse = JSON.parse;
  } else if (extname === '.yml' || extname === '.yaml') {
    parse = yaml.load;
  }
  return parse;
};

export default parseFn;
