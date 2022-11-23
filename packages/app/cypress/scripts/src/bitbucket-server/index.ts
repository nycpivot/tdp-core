import axios from 'axios'

type Credentials = {
  username: string
  password: string
}

export async function generateToken(serverEndpoint: string, auth: Credentials): Promise<string> {
  const response = await axios.put(`${serverEndpoint}/rest/access-tokens/latest/users/esback`, {
      expiryDays: 2154,
      name: "an e2e token",
      permissions: ["REPO_ADMIN", "PROJECT_ADMIN"]
    },
    {
      auth: auth
    })

  if (response.status !== 200) {
    throw new Error(`Failed to get token: ${response.statusText} [${response.status}]`)
  }

  return response.data.token
}