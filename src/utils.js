import path from 'path';

const utils = {
  exists: (fileSystem, filename) => {
    let exists = false;
    try {
      exists = fileSystem.statSync(filename).isFile();
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    return exists;
  },
  findModule: (fileSystem, start) => {
    const file = path.join(start, 'module.json');
    if (utils.exists(fileSystem, file)) {
      return require(file);
    }
    const up = path.dirname(start);
    // Reached root
    if (up !== start) {
      return utils.findModule(fileSystem, up);
    }
    return null;
  },
  deepClone: (obj) => {
    if (obj === null) return null;
    const clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
      (key) =>
        (clone[key] =
          typeof obj[key] === 'object' ? utils.deepClone(obj[key]) : obj[key])
    );
    return Array.isArray(obj) && obj.length
      ? (clone.length = obj.length) && Array.from(clone)
      : Array.isArray(obj)
      ? Array.from(obj)
      : clone;
  },
};

export default utils;
