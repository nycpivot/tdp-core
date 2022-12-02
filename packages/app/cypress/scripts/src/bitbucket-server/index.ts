import axios from 'axios';
import { checkIfServerIsReady, retry } from '../sleepUntil';

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

const FIVE_MINUTES = 5 * 60 * 1000;

async function waitUntilReady() {
  const now = new Date();
  await retry(bitbucketServerIsReady, new Date(now.getTime() + FIVE_MINUTES));
}

async function bitbucketServerIsReady(): Promise<void> {
  return checkIfServerIsReady(
    `http://localhost:7990/status`,
    response => response.status === 200 && response.data.state === 'RUNNING',
  );
}
