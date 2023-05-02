import { catalogAnnotationContainsRule } from './CatalogAnnotationContainsRule';

describe('catalogAnnotationContains', () => {
  describe('apply', () => {
    it('returns false when specified annotation is not present', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'bar',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'foo',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when no annotations are present', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'foo',
          },
        ),
      ).toEqual(false);
    });

    it('returns true when specified annotation has target value', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'bar',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'bar',
          },
        ),
      ).toEqual(true);
    });

    it('returns true when specified annotation value contains target value', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'foo,bar',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'foo',
          },
        ),
      ).toEqual(true);
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'foo, bar',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'foo',
          },
        ),
      ).toEqual(true);
    });

    it('returns false when the target value is substring of specified annotation item', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'foo-baz,bar-baz',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'foo',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when the specified annotation is empty', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': '',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'foo',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when specified annotation has different than expected value', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'bar',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: 'baz',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when target value is empty', () => {
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'bar',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: '',
          },
        ),
      ).toEqual(false);
      expect(
        catalogAnnotationContainsRule.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'bar, ',
              },
            },
          },
          {
            annotation: 'backstage.io/test-annotation',
            value: ' ',
          },
        ),
      ).toEqual(false);
    });
  });

  describe('toQuery', () => {
    it('returns an appropriate catalog-backend filter', () => {
      expect(
        catalogAnnotationContainsRule.toQuery({
          annotation: 'backstage.io/test-annotation',
          value: 'baz',
        }),
      ).toEqual({
        key: 'metadata.annotations.backstage.io/test-annotation',
      });
    });
  });
});
