import deepMerge from 'deepmerge';
import {
  cn,
  slideUnit,
  pct,
  boundedRange,
  safeArrayMerge,
  safeMergeOptions,
} from '../index';

describe('helpers', () => {
  describe('safeArrayMerge', () => {
    it('should return source array, ignoring destination', () => {
      const destination = [1, 2, 3];
      const source = [4, 5, 6];
      const result = safeArrayMerge(destination, source);
      expect(result).toBe(source);
      expect(result).toEqual([4, 5, 6]);
    });

    it('should work with empty arrays', () => {
      const destination = [1, 2, 3];
      const source = [];
      const result = safeArrayMerge(destination, source);
      expect(result).toBe(source);
      expect(result).toEqual([]);
    });

    it('should work with different array types', () => {
      const destination = ['a', 'b'];
      const source = ['c', 'd', 'e'];
      const result = safeArrayMerge(destination, source);
      expect(result).toBe(source);
      expect(result).toEqual(['c', 'd', 'e']);
    });
  });

  describe('safeMergeOptions', () => {
    it('should have correct arrayMerge function', () => {
      expect(safeMergeOptions.arrayMerge).toBe(safeArrayMerge);
    });

    it('should have clone set to false', () => {
      expect(safeMergeOptions.clone).toBe(false);
    });

    it('should have customMerge function', () => {
      expect(typeof safeMergeOptions.customMerge).toBe('function');
    });

    describe('customMerge function', () => {
      it('should return source merger for React internal keys', () => {
        const reactKeys = ['$$typeof', '_owner', '_store', 'ref', 'key'];
        
        reactKeys.forEach((key) => {
          const merger = safeMergeOptions.customMerge(key);
          expect(typeof merger).toBe('function');

          const target = 'target';
          const source = 'source';
          const result = merger(target, source);
          expect(result).toBe(source);
        });
      });

      it('should return undefined for non-React keys', () => {
        const normalKeys = ['prop', 'className', 'children', 'data'];
        
        normalKeys.forEach((key) => {
          const merger = safeMergeOptions.customMerge(key);
          expect(merger).toBeUndefined();
        });
      });
    });

    it('should work correctly with deepMerge for React props', () => {
      const target = {
        $$typeof: 'target-type',
        _owner: 'target-owner',
        _store: 'target-store',
        ref: 'target-ref',
        key: 'target-key',
        className: 'target-class',
        children: ['target-child'],
      };

      const source = {
        $$typeof: 'source-type',
        _owner: 'source-owner',
        _store: 'source-store',
        ref: 'source-ref',
        key: 'source-key',
        className: 'source-class',
        children: ['source-child'],
      };

      const result = deepMerge(target, source, safeMergeOptions);

      // React internal keys should use source values
      expect(result.$$typeof).toBe('source-type');
      // eslint-disable-next-line no-underscore-dangle
      expect(result._owner).toBe('source-owner');
      // eslint-disable-next-line no-underscore-dangle
      expect(result._store).toBe('source-store');
      expect(result.ref).toBe('source-ref');
      expect(result.key).toBe('source-key');

      // Regular props should be merged normally
      expect(result.className).toBe('source-class');
      expect(result.children).toEqual(['source-child']); // Arrays use safeArrayMerge
    });

    it('should handle nested objects with React keys', () => {
      const target = {
        props: {
          $$typeof: 'target-type',
          className: 'target-class',
        },
      };

      const source = {
        props: {
          $$typeof: 'source-type',
          className: 'source-class',
        },
      };

      const result = deepMerge(target, source, safeMergeOptions);

      expect(result.props.$$typeof).toBe('source-type');
      expect(result.props.className).toBe('source-class');
    });
  });
});
