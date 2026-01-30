# debounce_throttle

TypeScript debounce utility that preserves `this`, supports dynamic args, and exposes `cancel` and `flush`.

API

```ts
import debounce from './index';

const fn = (a: number, b: string) => a + b.length;
const d = debounce(fn, 200);
d(1, 'x');
d.cancel();
```

Examples


## GitHub Pages (automatic)

This repository includes a GitHub Actions workflow that builds the demo and deploys the `demo/` folder to the `gh-pages` branch on pushes to `main`. The workflow file is `.github/workflows/deploy.yml`.

To trigger a deploy:

1. Push your changes to `main`:

```bash
git add -A
git commit -m "Update demo"
git push origin main
```

2. After the workflow completes, enable GitHub Pages in your repository settings and set it to serve from the `gh-pages` branch.

If you'd like the workflow to publish to a different branch or folder (or use a custom domain), tell me and I can update the workflow accordingly.

Debounce (wait for last call):

```ts
import debounce from './index';

function save(value: string) {
	console.log('save', value);
}

const debouncedSave = debounce(save, 300);

debouncedSave('a');
debouncedSave('ab');
debouncedSave('abc');
// Only one `save` will run ~300ms after the last call with 'abc'

// If you need to force the pending save immediately:
debouncedSave.flush();

// To cancel a scheduled save:
debouncedSave.cancel();
```

Throttle (limit calls to at most once per interval):

```ts
import { throttle } from './index';

function onScroll(pos: number) {
	console.log('scroll', pos);
}

const throttledScroll = throttle(onScroll, 200);

throttledScroll(10); // runs immediately
throttledScroll(20); // suppressed, schedules a trailing call with 20

// Force the trailing invocation now and get the result (if any):
throttledScroll.flush();

// Cancel any scheduled trailing invocation:
throttledScroll.cancel();
```

Try it

```bash
npm install
npm run build
npm test
```

```bash
# produce a browser ESM bundle at demo/lib.mjs
npm run demo:bundle

# serve the demo on http://localhost:8080
npm run demo:serve
```

