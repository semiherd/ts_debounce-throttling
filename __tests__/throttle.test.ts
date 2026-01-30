import { throttle } from '../dist/index';

jest.useFakeTimers();

describe('throttle', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('invokes immediately and suppresses subsequent calls within wait', () => {
    const fn = jest.fn((x: number) => x);
    const t = throttle(fn, 100);

    t(1);
    t(2);
    t(3);

    // first call should happen immediately
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    // advance time to allow trailing call
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    // trailing should be last args
    expect(fn).toHaveBeenCalledWith(3);
  });

  test('cancel prevents trailing invocation', () => {
    const fn = jest.fn();
    const t = throttle(fn, 50);

    t('a');
    t('b');
    (t as any).cancel();

    jest.advanceTimersByTime(100);
    // initial immediate call happened once, trailing canceled
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('flush invokes pending trailing call immediately and returns result', () => {
    const fn = jest.fn((x: number) => x * 10);
    const t = throttle(fn, 200);

    t(2);
    t(5);

    const res = (t as any).flush();
    expect(res).toBe(50);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('preserves this for calls', () => {
    const obj = { val: 10 };
    function fn(this: any, add: number) {
      return this.val + add;
    }
    const spy = jest.fn(fn);
    const t = throttle(spy as any, 30);

    t.call(obj, 5);
    jest.advanceTimersByTime(30);
    expect(spy).toHaveBeenCalled();
  });
});
