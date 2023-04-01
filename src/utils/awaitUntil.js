/**
 * Awaits until a condition is met
 * @param {() => boolean} condition - A function that returns a boolean
 * @param {Number} timeout - The timeout in ms
 */
export default (condition, timeout = 100) => new Promise((resolve) => {
    const interval = setInterval(() => {
        if (condition()) {
            clearInterval(interval);
            resolve();
        }
    }, timeout);
});