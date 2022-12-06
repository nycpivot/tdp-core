import { BitbucketServer } from './bitbucket-server';

BitbucketServer.generateToken()
  .then(token => process.stdout.write(token))
  .catch(error => {
    process.stderr.write(`The token cannot be generated: ${error.message}\n`);
    process.exit(1);
  });
