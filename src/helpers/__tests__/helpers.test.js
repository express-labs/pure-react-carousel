import deepMerge from 'deepmerge';
import {
  cn,
  randomHexColor,
  slideUnit,
  slideSize,
  slideTraySize,
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
        
        reactKeys.forEach(key => {
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
        
        normalKeys.forEach(key => {
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
      expect(result._owner).toBe('source-owner');
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
        }
      };

      const source = {
        props: {
          $$typeof: 'source-type',
          className: 'source-class',
        }
      };

      const result = deepMerge(target, source, safeMergeOptions);

      expect(result.props.$$typeof).toBe('source-type');
      expect(result.props.className).toBe('source-class');
    });
  });

  // Test other helper functions to ensure they still work
  describe('existing helper functions', () => {
    it('cn should join class names correctly', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
      expect(cn(['class1', false, 'class2'])).toBe('class1 class2');
    });

    it('slideUnit should calculate correctly', () => {
      expect(slideUnit(1)).toBe(100);
      expect(slideUnit(2)).toBe(50);
      expect(slideUnit(4)).toBe(25);
    });

    it('pct should format percentages', () => {
      expect(pct(50)).toBe('50%');
      expect(pct(100)).toBe('100%');
    });

    it('boundedRange should constrain values', () => {
      expect(boundedRange({ min: 0, max: 10, x: 5 })).toBe(5);
      expect(boundedRange({ min: 0, max: 10, x: -5 })).toBe(0);
      expect(boundedRange({ min: 0, max: 10, x: 15 })).toBe(10);
    });
  });
});