function parse(yamlContent: string) {
  return {
    app: {
      plugins: [
        {
          name: '@esback/plugin-hello-world',
          version: '^0.1.0',
        },
      ],
    },
  };
}

describe('tpb configuration parser', () => {
  it('retrieves the app plugins', () => {
    const config = `
app:
  plugins:
    - name: "@esback/plugin-hello-world"
      version: "^0.1.0"
    `;
    const got = parse(config);

    expect(got.app.plugins).toContainEqual({
      name: '@esback/plugin-hello-world',
      version: '^0.1.0',
    });
  });
});
