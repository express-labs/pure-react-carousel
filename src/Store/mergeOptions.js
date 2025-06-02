const safeArrayMerge = (destination, source) => source;

const safeMergeOptions = {
  arrayMerge: safeArrayMerge,
  clone: false,
  customMerge: (key) => {
    if (key === '$$typeof' || key === '_owner' || key === '_store' || key === 'ref' || key === 'key') {
      return (target, source) => source;
    }
    return undefined;
  },
};

export { safeArrayMerge, safeMergeOptions };
