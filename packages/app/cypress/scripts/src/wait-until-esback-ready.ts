import {checkIfServerIsReady, sleepUntil} from "./sleepUntil";

async function esbackReady(): Promise<boolean> {
  if (process.env.CYPRESS_baseUrl) {
    return checkIfServerIsReady(process.env.CYPRESS_baseUrl, (response) => response.status === 200)
  }

  process.stdout.write("Please provide CYPRESS_baseUrl environment variable.")
  process.exit(1)
  return false
}

sleepUntil(esbackReady, 5 * 60 * 1000)
