import { EsbackSurface, SurfaceStore } from './types';

class FakeSurface1 implements EsbackSurface {
  public store: string[] = [];
  addStore(s: string) {
    this.store.push(s);
  }
}

class FakeSurface2 implements EsbackSurface {
  fake() {
    return 'fake';
  }
}

describe('GenericSurface test', () => {
  it('handles new surfaces', () => {
    const surface = new SurfaceStore();
    surface.applyTo(FakeSurface1, s => s.addStore('test'));

    const fake1 = surface.getSurfaceState(FakeSurface1);
    const fake2 = surface.getSurfaceState(FakeSurface2);

    expect(fake1.store).toHaveLength(1);
    expect(fake1.store[0]).toBe('test');
    expect(fake2).toBeDefined();
    expect(fake2.fake()).toBe('fake');
  });

  it('reuses initialized surface', () => {
    const surface = new SurfaceStore();
    surface.applyTo(FakeSurface1, s => s.addStore('test'));
    surface.applyTo(FakeSurface1, s => s.addStore('something'));

    const fake1 = surface.getSurfaceState(FakeSurface1);
    expect(fake1.store).toHaveLength(2);
    expect(fake1.store[0]).toBe('test');
    expect(fake1.store[1]).toBe('something');
  });

  it('works asynchronusly', async () => {
    const testCase = async () => {
      const surface = new SurfaceStore();

      const isolated = async (store: SurfaceStore, v: string) => {
        store.applyTo(FakeSurface1, s => s.addStore(v));
      };

      await Promise.all([
        isolated(surface, 'first'),
        isolated(surface, 'second'),
      ]);

      expect(surface.getSurfaceState(FakeSurface1).store).toHaveLength(2);
    };

    const testRuns = [];
    for (let index = 0; index < 50; index++) {
      testRuns.push(testCase());
    }
    return Promise.all(testRuns);
  });
});
