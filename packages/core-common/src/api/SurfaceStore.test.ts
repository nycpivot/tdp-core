import { TpbSurface, SurfaceStore } from '.';

class FakeSurface1 implements TpbSurface {
  public static readonly id = 'FakeSurface1';
  public readonly data: string[] = [];
  addData(s: string) {
    this.data.push(s);
  }
}

class FakeSurface2 implements TpbSurface {
  public static readonly id = 'FakeSurface2';
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
    const store = new SurfaceStore();
    store.applyTo(FakeSurface1, s => s.addData('test'));

    const fake1 = store.findSurface(FakeSurface1);
    const fake2 = store.findSurface(FakeSurface2);

    expect(fake1.data).toHaveLength(1);
    expect(fake1.data[0]).toBe('test');
    expect(fake2).toBeDefined();
    expect(fake2.fake()).toBe('fake');
  });

  it('reuses initialized surface', () => {
    const store = new SurfaceStore();
    store.applyTo(FakeSurface1, s => s.addData('test'));
    store.applyTo(FakeSurface1, s => s.addData('something'));

    const fake1 = store.findSurface(FakeSurface1);
    expect(fake1.data).toHaveLength(2);
    expect(fake1.data[0]).toBe('test');
    expect(fake1.data[1]).toBe('something');
  });

  it('handles surface dependencies independent of order', () => {
    const store = new SurfaceStore();

    store.applyWithDependency(FakeSurface2, FakeSurface1, (s2, s1) =>
      s2.setCount(s1.data.length),
    );

    store.applyTo(FakeSurface1, s => s.addData('test1'));
    store.applyTo(FakeSurface1, s => s.addData('test2'));

    expect(store.findSurface(FakeSurface2).count).toBe(2);
    expect(store.findSurface(FakeSurface1).data[0]).toBe('test1');
    expect(store.findSurface(FakeSurface1).data[1]).toBe('test2');
  });

  it('prevents cyclic dependencies', () => {
    const store = new SurfaceStore();

    store.applyWithDependency(FakeSurface1, FakeSurface2, (s1, s2) =>
      s1.addData(s2.fake()),
    );

    const dependencyCycle = () =>
      store.applyWithDependency(FakeSurface2, FakeSurface1, (s2, s1) =>
        s2.setCount(s1.data.length),
      );

    expect(dependencyCycle).toThrow();
  });

  it('works asynchronusly', async () => {
    const testCase = async () => {
      const isolated = async (store: SurfaceStore, d: string) => {
        store.applyTo(FakeSurface1, s => s.addData(d));
      };

      const store = new SurfaceStore();
      await Promise.all([isolated(store, 'first'), isolated(store, 'second')]);

      expect(store.findSurface(FakeSurface1).data).toHaveLength(2);
    };

    const testRuns = [];
    for (let index = 0; index < 50; index++) {
      testRuns.push(testCase());
    }
    return Promise.all(testRuns);
  });

  it('computes surface state only when necessary', () => {
    const store = new SurfaceStore();
    const modifier = jest.fn((surface: FakeSurface1) => {
      surface.addData('test');
    });

    store.applyTo(FakeSurface1, modifier);

    expect(store.findSurface(FakeSurface1).data).toHaveLength(1);
    expect(store.findSurface(FakeSurface1).data).toContain('test');
    expect(modifier).toHaveBeenCalledTimes(1);

    store.applyTo(FakeSurface1, s => s.addData('test2'));

    expect(store.findSurface(FakeSurface1).data).toContain('test');
    expect(store.findSurface(FakeSurface1).data).toContain('test2');
    expect(modifier).toHaveBeenCalledTimes(2);
  });
});
