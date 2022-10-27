import { EsbackSurface, SurfaceStore } from '.';

class FakeSurface1 implements EsbackSurface {
  public store: string[] = [];
  addStore(s: string) {
    this.store.push(s);
  }
}

class FakeSurface2 implements EsbackSurface {
  public count: number = 0;

  setCount(count: number) {
    this.count = count;
  }

  fake() {
    return 'fake';
  }
}

describe('SurfaceStore test', () => {
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

  it('handles surface dependencies independent of order', () => {
    const surface = new SurfaceStore();

    surface.applyWithDeps(FakeSurface2, FakeSurface1, (s2, s1) =>
      s2.setCount(s1.store.length),
    );

    surface.applyTo(FakeSurface1, s => s.addStore('test1'));
    surface.applyTo(FakeSurface1, s => s.addStore('test2'));

    expect(surface.getSurfaceState(FakeSurface2).count).toBe(2);
    expect(surface.getSurfaceState(FakeSurface1).store[0]).toBe('test1');
    expect(surface.getSurfaceState(FakeSurface1).store[1]).toBe('test2');
  });

  it('prevents cyclic dependencies', () => {
    const surface = new SurfaceStore();

    surface.applyWithDeps(FakeSurface1, FakeSurface2, (s1, s2) =>
      s1.addStore(s2.fake()),
    );

    const dependencyCycle = () =>
      surface.applyWithDeps(FakeSurface2, FakeSurface1, (s2, s1) =>
        s2.setCount(s1.store.length),
      );

    expect(dependencyCycle).toThrowError();
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
