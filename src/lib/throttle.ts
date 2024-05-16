type F = (...args: unknown[]) => void;

export function throttle(fn: F, delay: number): F {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: unknown[];

  return function wrapper(this: typeof wrapper, ...args) {
    lastArgs = args;
    if (timer) return;

    fn.apply(this, args);

    timer = setTimeout(() => {
      timer = undefined;
      if (lastArgs !== args) {
        wrapper.apply(this, lastArgs);
      }
    }, delay);
  };
}
