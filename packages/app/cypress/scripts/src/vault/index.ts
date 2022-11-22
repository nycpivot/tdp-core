import * as nv from "node-vault"

type VaultInfo = {
  endpoint: string
  token: string
}
export class Vault {
  private readonly vault: nv.client;

  static build(vaultInfo: VaultInfo): Vault { return new Vault(nv.default(vaultInfo)) }

  private constructor(client: nv.client) {
    this.vault = client
  }

  read(path: string, key: string): Promise<string> {
    return this.vault.read(path)
      .then(secret => Promise.resolve(secret.data[key]))
  }
}