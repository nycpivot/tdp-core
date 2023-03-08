export class DependencyGraph<T = number> {
  private readonly _nodes: Map<T, Set<T>>;

  constructor() {
    this._nodes = new Map();
  }

  public addDAGDependency(src: T, dest: T): boolean {
    this.addEdge(src, dest);
    const visited = new Set<T>();
    const recursiveStack = new Set<T>();

    for (const vertice of this._nodes.keys()) {
      if (this.isCyclicUtil(vertice, visited, recursiveStack)) {
        this._nodes.get(src)?.delete(dest);
        return false;
      }
    }

    return true;
  }

  // Taken from https://www.geeksforgeeks.org/detect-cycle-in-a-graph/
  private isCyclicUtil(
    key: T,
    visited: Set<T>,
    recursiveStack: Set<T>,
  ): boolean {
    if (recursiveStack.has(key)) return true;

    if (visited.has(key)) return false;

    visited.add(key);
    recursiveStack.add(key);

    if (this._nodes.has(key)) {
      for (const childKey of this._nodes.get(key)!.values()) {
        if (this.isCyclicUtil(childKey, visited, recursiveStack)) return true;
      }
    }

    recursiveStack.delete(key);

    return false;
  }

  private addEdge(src: T, dest: T) {
    if (!this._nodes.has(src)) {
      this._nodes.set(src, new Set());
    }

    this._nodes.get(src)!.add(dest);
    return this;
  }
}
