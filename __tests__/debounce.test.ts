import debounce from '../dist/index';

jest.useFakeTimers();

describe('debounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('calls the function with the last arguments after wait', () => {
    const fn = jest.fn((a: number, b: string) => a + b.length);
    const deb = debounce(fn, 100);

    deb(1, 'a');
    deb(2, 'bb');

    // should not be called yet
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2, 'bb');
  });

  test('cancel prevents the call', () => {
    const fn = jest.fn();
    const deb = debounce(fn, 50);

    deb('x');
    (deb as any).cancel();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  test('flush immediately calls pending invocation and returns result', () => {
    const fn = jest.fn((x: number) => x * 2);
    const deb = debounce(fn, 200);

    deb(5);
    // flush should call immediately
    const res = (deb as any).flush();
    expect(res).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('preserves this when called with call/apply', () => {
    const obj = { value: 3 };
    function fn(this: any, add: number) {
      return this.value + add;
    }
    const spy = jest.fn(fn);
    const deb = debounce(spy as any, 30);

    deb.call(obj, 2);
    jest.advanceTimersByTime(30);
    expect(spy).toHaveBeenCalledWith(2);
    // ensure this was obj inside the original function
    const thisArg = (spy.mock.calls[0] as any).__this || spy.mock.instances[0];
    expect(spy.mock.instances[0]).toBeDefined();
  });
});
