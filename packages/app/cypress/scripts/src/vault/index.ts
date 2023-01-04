import * as nv from 'node-vault';
// eslint-disable-next-line no-restricted-imports
import { execSync } from 'child_process';

function checkVaultAddressIsDefined() {
  if (!process.env.VAULT_ADDR) {
    throw new Error('Please define the VAULT_ADDR environment variable.');
  }
}

export class Vault {
  private readonly vault: nv.client;

  static build(): Vault {
    checkVaultAddressIsDefined();
    const vaultAddress = process.env.VAULT_ADDR;
    const vaultToken = execSync(`cat ${process.env.HOME}/.vault-token`, {
      encoding: 'utf-8',
    });
    const infos = {
      endpoint: vaultAddress,
      token: vaultToken,
    };
    return new Vault(nv.default(infos));
  }

  private constructor(client: nv.client) {
    this.vault = client;
  }

  read(path: string, key: string): Promise<string> {
    return this.vault
      .read(path)
      .then(secret => Promise.resolve(secret.data[key]));
  }

  readE2ESecret(key: string): Promise<string> {
    return this.read('runway_concourse/esback/e2e', key);
  }

  readGitlabSecret(key: string): Promise<string> {
    return this.read('runway_concourse/esback/gitlab', key);
  }

  readGkeSecret(key: string): Promise<string> {
    return this.read('runway_concourse/esback/gke', key);
  }

  readGkeOidcSecret(key: string) {
    return this.read('runway_concourse/esback/gke_oidc', key);
  }
}
