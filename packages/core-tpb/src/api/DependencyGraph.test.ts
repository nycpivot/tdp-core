import { DependencyGraph } from './DependencyGraph';

describe('DependencyGraph tests', () => {
  it('allows creation of non-cyclic dependencies', () => {
    const graph = new DependencyGraph();

    expect(graph.addDAGDependency(0, 1)).toBeTruthy();
    expect(graph.addDAGDependency(1, 2)).toBeTruthy();
    expect(graph.addDAGDependency(2, 4)).toBeTruthy();
    expect(graph.addDAGDependency(3, 4)).toBeTruthy();
    expect(graph.addDAGDependency(3, 5)).toBeTruthy();
    expect(graph.addDAGDependency(1, 2)).toBeTruthy();
  });

  it('rejects creation of cyclic dependencies', () => {
    const graph = new DependencyGraph();

    expect(graph.addDAGDependency(0, 0)).toBeFalsy();
    expect(graph.addDAGDependency(0, 1)).toBeTruthy();
    expect(graph.addDAGDependency(1, 2)).toBeTruthy();
    expect(graph.addDAGDependency(2, 0)).toBeFalsy();
    expect(graph.addDAGDependency(3, 4)).toBeTruthy();
    expect(graph.addDAGDependency(3, 6)).toBeTruthy();
    expect(graph.addDAGDependency(4, 5)).toBeTruthy();
    expect(graph.addDAGDependency(5, 3)).toBeFalsy();
  });
});
