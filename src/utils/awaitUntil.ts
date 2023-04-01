/**
 * Awaits until a condition is met
 * @param {() => boolean} condition - A function that returns a boolean
 * @param {Number} timeout - The timeout in ms
 */
export default function awaitUntil(condition: () => boolean, timeout: number = 100) {
    return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            if (condition()) {
                clearInterval(interval);
                resolve();
            }
        }, timeout);
    });
}