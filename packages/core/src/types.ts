export interface EsbackSurface {}

type SurfaceModifier<T extends EsbackSurface> = (s: T) => void;

interface SurfaceEntry<T extends EsbackSurface> {
  Surface: { new (): T };
  modifiers: SurfaceModifier<T>[];
}

// class SurfaceNode<T extends EsbackSurface> {
//   readonly _id: number
//   readonly _surface: T
//   private readonly _modifiers: SurfaceModifier<T, any>[]

//   constructor(surface: T, modifier: SurfaceModifier<T> | undefined = undefined) {
//     this._id = Date.now()
//     this._surface = surface
//     this._modifiers = []

//     if (modifier) {
//       this._modifiers.push(modifier)
//     }
//   }

//   addModifier(modifier: SurfaceModifier<T, any>) {
//     this._modifiers.push(modifier)
//   }
// }

export class SurfaceStore {
  private readonly _surfaces: SurfaceEntry<any>[] = [];
  // private readonly _computed: Boolean = false
  // private readonly _surfacesDeps: DirectedGraph<number, SurfaceNode<any>> = new DirectedGraph()

  public applyTo<T extends EsbackSurface>(
    surfaceClass: { new (): T },
    modifier: SurfaceModifier<T>,
  ) {
    this.getSurfaceEntry(surfaceClass).modifiers.push(modifier);
  }

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
      Surface: surfaceClass,
      modifiers: [],
    };
    this._surfaces.push(newSurface);
    return newSurface;
  }

  // public applyWithDeps<T extends EsbackSurface, K extends EsbackSurface>(src: { new (): T}, dest: { new (): K }, modifier: SurfaceModifier<T, K>) {
  //   const targetSurface = this.getSurfaceNode(dest)
  //   const currentSurface = this.getSurfaceNode(src)

  //   this._surfacesDeps.addEdge(currentSurface._id, targetSurface._id)
  //   currentSurface.addModifier(modifier)
  // }

  // public getSurface<T extends EsbackSurface>(c: { new (): T}): T {
  //   if (!this._computed) {
  //     throw new Error("Accessing surface before surface store has been properly initialized")
  //   }

  //   const node = this._surfaces.find(s => s._surface instanceof c)
  //   return node?._surface
  // }

  // public initialize() {
  // }
}

// export class GenericSurface {
//   private readonly _surfaces: EsbackSurface[] = []

//   public registerSurface<T extends EsbackSurface>(surface: T) {
//     const currentIndex = this._surfaces.findIndex(s => typeof s === typeof surface)

//     if (currentIndex < 0) {
//       this._surfaces.push(surface)
//     } else {
//       this._surfaces[currentIndex] = surface
//     }
//   }

//   public getSurface<T extends EsbackSurface>(c: { new (): T}): T {
//     const surface = this._surfaces.find(s => s instanceof c)

//     if (surface) {
//       return surface as T
//     }

//     const newSurface = new c()
//     this._surfaces.push(newSurface)
//     return newSurface
//   }
// }

export interface RoutableConfig {
  path?: string;
  label?: string;
}

export type EsbackPluginInterface = (context: SurfaceStore) => void;

export type AppPluginInterface<T = {}> = (config?: T) => EsbackPluginInterface;

interface BackendPluginConfig {
  name?: string;
  path?: string;
}

export type BackendPluginInterface<T = {}> = (
  config?: T & BackendPluginConfig,
) => EsbackPluginInterface;
