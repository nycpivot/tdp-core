import { DependencyGraph } from './DependencyGraph';
import { v4 as uuidv4 } from 'uuid';
import { EsbackSurface } from './EsbackSurface';

type SurfaceModifier<T extends EsbackSurface> = (s: T) => void;

interface SurfaceEntry<T extends EsbackSurface> {
  id: string;
  Surface: { new (): T };
  modifiers: SurfaceModifier<T>[];
}

export class SurfaceStore {
  private readonly _surfaces: SurfaceEntry<any>[] = [];
  private readonly _surfaceDependencies: DependencyGraph<string> =
    new DependencyGraph();

  public applyTo<T extends EsbackSurface>(
    surfaceClass: { new (): T },
    modifier: SurfaceModifier<T>,
  ) {
    this.getSurfaceEntry(surfaceClass).modifiers.push(modifier);
  }

  // TODO: Look into the following ideas:
  // Expose a single method instead of 2
  // Make dest an array ?
  public applyWithDeps<T extends EsbackSurface, U extends EsbackSurface>(
    src: { new (): T },
    dest: { new (): U },
    modifier: (surface: T, dependency: U) => void,
  ) {
    const currentSurface = this.getSurfaceEntry(src);
    const targetSurface = this.getSurfaceEntry(dest);

    if (
      !this._surfaceDependencies.addDAGDependency(
        currentSurface.id,
        targetSurface.id,
      )
    ) {
      throw new Error(
        `Dependency cycle detected between ${src.name} and ${dest.name}`,
      );
    }

    currentSurface.modifiers.push(surface => {
      const dep = this.getSurfaceState(dest);
      modifier(surface, dep);
    });
  }

  // TODO: Store computed state
  public getSurfaceState<T extends EsbackSurface>(surfaceClass: {
    new (): T;
  }): T {
    const entry = this.getSurfaceEntry(surfaceClass);
    const surface = new entry.Surface();
    entry.modifiers.forEach(m => m(surface));

    return surface;
  }

  private getSurfaceEntry<T extends EsbackSurface>(surfaceClass: {
    new (): T;
  }): SurfaceEntry<T> {
    const surface = this._surfaces.find(s => s.Surface === surfaceClass);

    if (surface) {
      return surface;
    }

    const newSurface: SurfaceEntry<T> = {
      id: uuidv4(),
      Surface: surfaceClass,
      modifiers: [],
    };
    this._surfaces.push(newSurface);
    return newSurface;
  }
}
