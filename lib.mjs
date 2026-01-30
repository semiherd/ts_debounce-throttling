// index.ts
function debounce(fn, wait) {
  if (typeof fn !== "function") {
    throw new TypeError("Expected the first argument to be a function");
  }
  if (typeof wait !== "number" || Number.isNaN(wait) || wait < 0) {
    throw new TypeError("Expected the second argument to be a non-negative number (milliseconds)");
  }
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastResult;
  function clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }
  const debounced = function(...args) {
    lastArgs = args;
    lastThis = this;
    clearTimer();
    timerId = setTimeout(() => {
      timerId = null;
      try {
        lastResult = fn.apply(lastThis, lastArgs);
      } finally {
        lastArgs = lastThis = null;
      }
    }, wait);
  };
  debounced.cancel = function() {
    clearTimer();
    lastArgs = lastThis = null;
  };
  debounced.flush = function() {
    if (timerId === null) {
      return lastResult;
    }
    clearTimer();
    const args = lastArgs;
    lastArgs = lastThis = null;
    try {
      lastResult = fn.apply(lastThis, args);
    } finally {
      lastArgs = lastThis = null;
    }
    return lastResult;
  };
  return debounced;
}
function throttle(fn, wait) {
  if (typeof fn !== "function") {
    throw new TypeError("Expected the first argument to be a function");
  }
  if (typeof wait !== "number" || Number.isNaN(wait) || wait < 0) {
    throw new TypeError("Expected the second argument to be a non-negative number (milliseconds)");
  }
  let timer = null;
  let lastArgs = null;
  let lastThis = null;
  let lastResult;
  let lastCallTime = 0;
  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }
  const throttled = function(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);
    lastArgs = args;
    lastThis = this;
    if (lastCallTime === 0 || remaining <= 0) {
      lastCallTime = now;
      lastResult = fn.apply(this, args);
      lastArgs = lastThis = null;
    } else if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        lastCallTime = Date.now();
        lastResult = fn.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
      }, remaining);
    }
  };
  throttled.cancel = function() {
    clearTimer();
    lastArgs = lastThis = null;
    lastCallTime = 0;
  };
  throttled.flush = function() {
    if (!timer)
      return lastResult;
    clearTimer();
    lastCallTime = Date.now();
    const args = lastArgs;
    const ctx = lastThis;
    lastArgs = lastThis = null;
    lastResult = fn.apply(ctx, args);
    return lastResult;
  };
  return throttled;
}
export {
  debounce as default,
  throttle
};
