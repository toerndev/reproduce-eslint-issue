import { ResponseTimesMillis, WaitingTimesMillis } from ".";

interface DeferredSettleOptions {
  readonly delay?: number;
  readonly minDuration?: number;
  readonly delayedCallback?: VoidFunction;
}

export function someFunction<T>(
  promise: Promise<T>,
  {
    delay = ResponseTimesMillis.Immediate,
    minDuration = WaitingTimesMillis.Short,
    delayedCallback,
  }: DeferredSettleOptions = {}
): Promise<T> {
  const start = Date.now();
  const cbTimer =
    delayedCallback !== undefined
      ? window.setTimeout(delayedCallback, delay)
      : undefined;
  return new Promise((resolve, reject) => {
    promise.then(
      (result) => {
        const duration = Date.now() - start;
        if (duration < delay) {
          window.clearTimeout(cbTimer);
          resolve(result);
        } else if (duration < minDuration) {
          setTimeout(() => resolve(result), minDuration - duration);
        } else {
          resolve(result);
        }
      },
      (error) => {
        const duration = Date.now() - start;
        if (duration < delay) {
          window.clearTimeout(cbTimer);
          reject(error);
        } else if (duration < minDuration) {
          setTimeout(() => reject(error), minDuration - duration);
        } else {
          reject(error);
        }
      }
    );
  });
}
