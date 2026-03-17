export function throttle<T>(fn: (args: T) => void, delay: number) {
  let pending = false;
  return (args: T) => {
    if (pending) {
      return;
    }
    pending = true;
    setTimeout(() => {
      fn(args);
      pending = false;
    }, delay);
  };
}