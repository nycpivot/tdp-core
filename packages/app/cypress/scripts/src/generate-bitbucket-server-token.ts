import { BitbucketServer } from './bitbucket-server';

BitbucketServer.generateToken().then(token => process.stdout.write(token));
