import * as BitbucketServer from "@atlassian/bitbucket-server"

describe("Bitbucket Server", () => {
  it('should render the bitbucket server catalog', async () => {
    const bitbucket = new BitbucketServer({
      baseUrl: `http://${process.env.BITBUCKET_HOST}`
    })
    bitbucket.authenticate({ type: 'basic', username: 'esback', password: 'esback' })
    cy.visit('/');
    cy.contains('bitbucket-server-component');
  });
})