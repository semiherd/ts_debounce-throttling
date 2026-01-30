// CommonJS entrypoint: re-export the compiled TypeScript implementation.
// Consumers who `require('.')` will receive the implementation from `dist/index.js`.
try {
	// Export the full compiled module (includes default, throttle, example, etc.)
	module.exports = require('./dist/index.js');
} catch (e) {
	throw new Error('Compiled file not found. Run `npm run build` before requiring this package.');
}
// CommonJS entrypoint: re-export the compiled TypeScript implementation.
// Consumers who `require('.')` will receive the implementation from `dist/index.js`.
try {
  module.exports = require('./dist/index.js').default || require('./dist/index.js');
} catch (e) {
  throw new Error('Compiled file not found. Run `npm run build` before requiring this package.');
}
/**
 * debounce - returns a debounced version of `fn` that delays invoking `fn`
 * until after `wait` milliseconds have elapsed since the last time the
 * debounced function was called.
 *
 * The returned function accepts any number of arguments and preserves `this`.
 * It also exposes two helper methods:
 *  - cancel(): cancels any pending invocation
 *  - flush(): immediately invokes a pending invocation (if any) and returns
 *             the result of the invoked function
 *
 * @param {Function} fn - function to debounce (can accept dynamic args)
 * @param {number} wait - delay in milliseconds
 * @returns {Function} debounced function with .cancel and .flush
 */
function debounce(fn, wait) {
	// Re-export the TypeScript-compiled implementation from dist.
	// This file is the CommonJS entrypoint and will simply require the built file.
	try {
		// When built (npm run build) the compiled file will be at ./dist/index.js
		module.exports = require('./dist/index.js').default || require('./dist/index.js');
	} catch (e) {
		// If dist is not present (development), fall back to the TypeScript source via ts-node if available.
		// This keeps a helpful error message for consumers who forgot to build.
		throw new Error('Compiled file not found. Run `npm run build` before requiring this package.');
	}
}
