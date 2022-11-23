import axios from "axios";

export const sleepUntil = async (f: () => Promise<boolean>, timeoutMs: number) => {
  return new Promise((resolve, reject) => {
    const timeWas = new Date().getTime();
    const wait = setInterval(async function () {
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

type validateResponse = (response: { data: any, status: number }) => boolean

export const checkIfServerIsReady = async (endpoint: string, validator: validateResponse): Promise<boolean> => {
  try {
    const response = await axios.get(endpoint)
    return validator({
      data: response.data,
      status: response.status
    })
  } catch (e) {
    process.stderr.write(`Server apparently not ready yet at address ${endpoint}: ${e}\n`)
  }

  return false
}