import axios from 'axios'

export async function generateToken(): Promise<string> {
  const host = process.env.BITBUCKET_HOST;
  const response = await axios.put(`http://${host}/rest/access-tokens/latest/users/esback`, {
      expiryDays: 2154,
      name: "an e2e token",
      permissions: ["REPO_ADMIN",
        "PROJECT_ADMIN"]
    },
    {
      auth: {
        username: "esback",
        password: "esback"
      }
    })

  if (response.status !== 200) {
    throw new Error(`Failed to get token: ${response.statusText} [${response.status}]`)
  }

  return response.data.token
}

generateToken()
  .then(token => process.stdout.write(token))
  .catch(error => process.stderr.write(error.toString()))