import axios from 'axios';
import { checkIfServerIsReady, sleepUntil } from '../sleepUntil';

export namespace BitbucketServer {
  export async function generateToken(): Promise<string> {
    process.stderr.write(
      'Waiting for Bitbucket Server to be ready (it might take a while)...\n',
    );
    await waitUntilReady();

    const response = await axios.put(
      `http://localhost:7990/rest/access-tokens/latest/users/esback`,
      {
        expiryDays: 2154,
        name: 'an e2e token',
        permissions: ['REPO_ADMIN', 'PROJECT_ADMIN'],
      },
      {
        auth: {
          username: 'esback',
          password: 'esback',
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to get token: ${response.statusText} [${response.status}]`,
      );
    }

    return response.data.token;
  }
}

async function waitUntilReady() {
  await sleepUntil(bitbucketServerIsReady, 5 * 60 * 1000);
}

async function bitbucketServerIsReady(): Promise<boolean> {
  return checkIfServerIsReady(
    `http://localhost:7990/status`,
    response => response.status === 200 && response.data.state === 'RUNNING',
  );
}
