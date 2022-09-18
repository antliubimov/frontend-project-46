const isObject = (obj) =>
  Object.prototype.toString.call(obj) === '[object Object]';

export { isObject };
