interface Reverseable {
    (reverse: Function): void;
    reverse: Function;
    hasReversed: boolean;
};

export function createReverseable(): Reverseable {
    const reverses: Function[] = [];

    const reverser = (reverse: Function) => {
        if (typeof reverse !== "function") {
            throw new Error("Reverser must be a function");
        }

        reverses.push(reverse);
    };

    return Object.assign(reverser, {
        hasReversed: false,
        reverse() {
            for (let i = reverses.length - 1; i >= 0; i--) {
                typeof reverses[i] === "function" && reverses[i]();
            }

            this.hasReversed = true;
        }
    });
}