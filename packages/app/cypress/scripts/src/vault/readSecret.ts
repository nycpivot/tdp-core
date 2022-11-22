import * as nv from "node-vault"

const options = {
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
}

const vault = nv.default(options)

if (process.argv.length !== 4) {
  process.stderr.write("Please provide the path to the secret and the secret key.\n")
  process.exit(1)
}

const path = process.argv[2]
const key = process.argv[3]


vault.read(path)
.then(secret => process.stdout.write(secret.data[key]))
.catch(e => process.stderr.write(`error reading secret: ${e}`))


