// mergeDeep(this, { a: { b: { c: 123 } } });
// // or
// const merged = mergeDeep({a: 1}, { b : { c: { d: { e: 12345}}}});  
// console.dir(merged); // { a: 1, b: { c: { d: [Object] } } }

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function merge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}

module.exports = {
  isObject,
  merge
}