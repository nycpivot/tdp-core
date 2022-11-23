import axios from 'axios'
import {sleepUntil, checkIfServerIsReady} from "../sleepUntil";

const host = process.env.BITBUCKET_HOST;
const auth = {
  username: "esback",
  password: "esback"
}

async function generateToken(): Promise<string> {
  const response = await axios.put(`http://${host}/rest/access-tokens/latest/users/esback`, {
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

async function bitbucketServerIsReady(): Promise<boolean> {
  return checkIfServerIsReady(`http://${host}/status`, (response) => response.status === 200 && response.data.state === "RUNNING")
}

sleepUntil(bitbucketServerIsReady, 5 * 60 * 1000)
  .then(generateToken)
  .then(token => process.stdout.write(token))
  .catch(error => process.stderr.write(error.toString()))