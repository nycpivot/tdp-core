import axios from 'axios'

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

const sleepUntil = async (f: () => Promise<boolean>, timeoutMs: number) => {
  return new Promise((resolve, reject) => {
    const timeWas = new Date().getTime();
    const wait = setInterval(async function() {
      const ready = await f()
      if (ready) {
        clearInterval(wait);
        resolve(undefined);
      } else if (new Date().getTime() - timeWas > timeoutMs) { // Timeout
        process.stderr.write(`rejected after ${new Date().getTime() - timeWas} ms\n`);
        clearInterval(wait);
        reject();
      }
    }, 5000);
  });
}

async function bitbucketServerIsReady(): Promise<boolean> {
  try {
    const response = await axios.get(`http://${host}/status`)
    if (response.status === 200) {
      if (response.data.state === "RUNNING") {
        return true
      }
    }
  } catch (e) {
    process.stderr.write(`Bitbucket Server apparently not ready yet: ${e}\n`)
  }

  return false
}

sleepUntil(bitbucketServerIsReady, 5*60*1000)
  .then(generateToken)
  .then(token => process.stdout.write(token))
  .catch(error => process.stderr.write(error.toString()))