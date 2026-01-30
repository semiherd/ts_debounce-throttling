/**
 * Strongly-typed debounce for TypeScript
 *
 * Usage:
 *   const debounced = debounce((x: number, y: string) => x + y.length, 200);
 *   debounced(1, 'a');
 *
 * The returned function preserves `this` and supports any number of args.
 */

type Timer = ReturnType<typeof setTimeout> | null;
type This<T> = ThisParameterType<T>;
type Args<T extends (...args: any[]) => any> = Parameters<T>;
type R<T extends (...args: any[]) => any> = ReturnType<T>;

export default function debounce<T extends (this: any, ...args: any[]) => any>(
    fn: T,
    wait: number
) {
    if (typeof fn !== 'function') {
        throw new TypeError('Expected the first argument to be a function');
    }
    if (typeof wait !== 'number' || Number.isNaN(wait) || wait < 0) {
        throw new TypeError('Expected the second argument to be a non-negative number (milliseconds)');
    }
 
    type DebouncedMethods={ 
        cancel(): void; 
        flush(): R<T> | undefined 
    }
 
    type Debounced= ((...args: Args<T>) => void) & DebouncedMethods;

    let timerId: Timer = null;
    let lastArgs: Args<T> | null = null;
    let lastThis: This<T> | null = null;
    let lastResult: R<T> | undefined;

    function clearTimer() {
        if (timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
        }
    }

    const debounced:(...args: Args<T>) => void = function(this: This<T>, ...args: Args<T>): void {
        lastArgs = args;
        lastThis = this;
        clearTimer();
        timerId = setTimeout(() => {
            timerId = null;
            try{
                lastResult = fn.apply(lastThis as This<T>, lastArgs as Args<T>);
            }finally {
                lastArgs = lastThis = null;
            }
        }, wait);
    };

    (debounced as Debounced).cancel = function():void {
        clearTimer();
        lastArgs = lastThis = null;
    };

    (debounced as Debounced).flush = function(): R<T> | undefined {
        if (timerId === null) {
            return lastResult;
        }
        clearTimer();
        const args = lastArgs as Args<T>;
        lastArgs = lastThis = null;
        try{
            lastResult = fn.apply(lastThis as This<T>, args);
        }finally {
            lastArgs = lastThis = null;
        }
        return lastResult;
    };

    return debounced as ((...args: Args<T>) => void) & DebouncedMethods;
}

/**
 * throttle - returns a throttled version of `fn` that ensures `fn` is called
 * at most once every `wait` milliseconds. Calls during the wait period will
 * schedule a trailing invocation with the last provided arguments.
 *
 * The returned function preserves `this` and exposes `cancel()` and `flush()`.
 */
export function throttle<T extends (this: any, ...args: any[]) => any>(fn: T, wait: number) {
    if (typeof fn !== 'function') {
        throw new TypeError('Expected the first argument to be a function');
    }
    if (typeof wait !== 'number' || Number.isNaN(wait) || wait < 0) {
        throw new TypeError('Expected the second argument to be a non-negative number (milliseconds)');
    }

    type ThrottledMethods={ 
        cancel(): void; 
        flush(): R<T> | undefined 
    }
    type Throttled= ((...args: Args<T>) => void) & ThrottledMethods;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Args<T> | null = null;
    let lastThis: This<T> | null = null;
    let lastResult: R<T> | undefined;
    let lastCallTime = 0;

    function clearTimer() {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
    }

    const throttled:(...args: Args<T>) => void = function(this: This<T>, ...args: Args<T>): void {
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
                lastResult = fn.apply(lastThis as This<T>, lastArgs as Args<T>);
                lastArgs = lastThis = null;
            }, remaining);
        }
    };

    (throttled as Throttled).cancel = function() {
        clearTimer();
        lastArgs = lastThis = null;
        lastCallTime = 0;
    };

    (throttled as Throttled).flush = function(): R<T> | undefined {
        if (!timer) return lastResult;
        clearTimer();
        lastCallTime = Date.now();
        const args = lastArgs as Args<T>;
        const ctx = lastThis as This<T>;
        lastArgs = lastThis = null;
        lastResult = fn.apply(ctx, args);
        return lastResult;
    };

    return throttled as ((...args: Args<T>) => void) & ThrottledMethods;
}
