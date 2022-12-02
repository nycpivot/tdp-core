import axios from 'axios';

const asyncCallWithTimeout = async (
  asyncPromise: Promise<void>,
  timeLimit: number,
) => {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<boolean>((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Async call timeout limit reached')),
      timeLimit,
    );
  });

  return Promise.race([asyncPromise, timeoutPromise]).then(result => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

export async function retry(
  operation: () => Promise<void>,
  until: Date,
  interval = 10000,
): Promise<any> {
  return await operation().catch(async error => {
    const now = new Date();
    const timeLeft = until.getTime() - now.getTime();
    if (timeLeft > 0) {
      process.stderr.write(
        `[Time left: ${timeLeft / 1000} seconds]: ${error.message}\n`,
      );
      await pause(interval);
      return retry(operation, until, interval);
    }
    throw new Error('Timeout reached');
  });
}

function pause(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
type validateResponse = (response: { data: any; status: number }) => boolean;

export const checkIfServerIsReady = async (
  endpoint: string,
  validator: validateResponse,
): Promise<void> => {
  try {
    const response = await axios.get(endpoint);
    const ready = validator({
      data: response.data,
      status: response.status,
    });
    if (ready) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        `Server not ready yet. Response: ${response.status} - ${response.statusText}`,
      ),
    );
  } catch (e) {
    return Promise.reject(
      new Error(`Server apparently not ready yet at address ${endpoint}: ${e}`),
    );
  }
};
