import { BackendRuntime } from "./BackendRuntime"

describe('BackendRuntime', () => {
  it('should add default plugins', () => {
    const { surfaces } = new BackendRuntime()

    expect(surfaces.pluginSurface.plugins).toHaveLength(3)
  })

  it('should set main app', () => {
    const { surfaces } = new BackendRuntime()

    expect(surfaces.pluginSurface.mainApp).toBeDefined()
  })
})