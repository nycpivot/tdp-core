import { BitbucketServer } from './bitbucket-server';
import { DockerCompose } from './docker-compose';

async function startContainers(env: any) {
  const options = { env: env };
  DockerCompose.destroy(options);
  DockerCompose.up('bitbucket', options);
  const token = await BitbucketServer.generateToken();
  process.stdout.write(`Generated token for bitbucket token: ${token}`);
  DockerCompose.up('esback', {
    env: { ...options.env, BITBUCKET_TOKEN: token },
  });
}

startContainers(process.env).then(r =>
  process.stdout.write('Containers started\n\n'),
);
