import { DependencyGraph } from './DependencyGraph';
import { v4 as uuidv4 } from 'uuid';
import { TpbSurface } from './TpbSurface';

type SurfaceModifier<T extends TpbSurface> = (s: T) => void;

interface SurfaceConstructor<T> {
  new (): T;
  id: string;
}

class SurfaceEntry<T extends TpbSurface> {
  readonly id: string;
  readonly Surface: SurfaceConstructor<T>;
  private readonly _modifiers: SurfaceModifier<T>[];
  private _state: T | undefined;

  constructor(id: string, surfaceClass: SurfaceConstructor<T>) {
    this.id = id;
    this.Surface = surfaceClass;
    this._modifiers = [];
  }

  addModifier(modifier: SurfaceModifier<T>) {
    this._state = undefined;
    this._modifiers.push(modifier);
  }

  get state(): T {
    if (this._state) {
      return this._state;
    }

    this._state = new this.Surface();
    this._modifiers.forEach(modifier => modifier(this._state!));
    return this._state;
  }
}

export interface SurfaceStoreInterface {
  applyTo<T extends TpbSurface>(
    surfaceClass: SurfaceConstructor<T>,
    modifier: SurfaceModifier<T>,
  ): void;
  applyWithDependency<T extends TpbSurface, U extends TpbSurface>(
    targetClass: SurfaceConstructor<T>,
    dependencyClass: SurfaceConstructor<U>,
    modifier: (surface: T, dependency: U) => void,
  ): void;
  findSurface<T extends TpbSurface>(surfaceClass: SurfaceConstructor<T>): T;
}

export class SurfaceStore implements SurfaceStoreInterface {
  private readonly _entries: SurfaceEntry<any>[] = [];
  private readonly _surfaceDependencies: DependencyGraph<string> =
    new DependencyGraph();

  public applyTo<T extends TpbSurface>(
    surfaceClass: SurfaceConstructor<T>,
    modifier: SurfaceModifier<T>,
  ) {
    this.getSurfaceEntry(surfaceClass).addModifier(modifier);
  }

  public applyWithDependency<T extends TpbSurface, U extends TpbSurface>(
    targetClass: SurfaceConstructor<T>,
    dependencyClass: SurfaceConstructor<U>,
    modifier: (surface: T, dependency: U) => void,
  ) {
    const target = this.getSurfaceEntry(targetClass);
    const dependency = this.getSurfaceEntry(dependencyClass);

    if (!this._surfaceDependencies.addDAGDependency(target.id, dependency.id)) {
      throw new Error(
        `Dependency cycle detected between ${targetClass.name} and ${dependencyClass.name}`,
      );
    }

    target.addModifier(surface =>
      modifier(surface, this.findSurface(dependencyClass)),
    );
  }

  public findSurface<T extends TpbSurface>(
    surfaceClass: SurfaceConstructor<T>,
  ): T {
    return this.getSurfaceEntry(surfaceClass).state;
  }

  private getSurfaceEntry<T extends TpbSurface>(
    surfaceClass: SurfaceConstructor<T>,
  ): SurfaceEntry<T> {
    const entry = this._entries.find(s => s.Surface.id === surfaceClass.id);

    if (entry) {
      return entry;
    }

    const newSurface = new SurfaceEntry<T>(uuidv4(), surfaceClass);
    this._entries.push(newSurface);
    return newSurface;
  }
}
