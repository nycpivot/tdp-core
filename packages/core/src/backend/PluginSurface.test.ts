import { PluginSurface } from './PluginSurface';

describe('PluginSurface', () => {
  const fakePlugin = {
    name: 'fakePlugin',
    path: '/fake',
    pluginFn: jest.fn(),
  };

  it('should not allow plugin duplication', () => {
    const surface = new PluginSurface();
    surface.addPlugin(fakePlugin);
    surface.addPlugin({ ...fakePlugin });

    expect(surface.plugins).toHaveLength(1);
  });

  it('should remove leading forward-slash from path', () => {
    const surface = new PluginSurface();
    surface.addPlugin(fakePlugin);

    expect(surface.plugins).toHaveLength(1);
    expect(surface.plugins[0].path).toBe('fake');
  });
});
