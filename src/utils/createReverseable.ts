interface Reverseable {
    (reverse: Function): void;
    reverse: Function;
    hasReversed: boolean;
};

export default function createReverseable(): Reverseable {
    const reverses: Function[] = [];

    function reverser(reverse: Function) {
        if (typeof reverse !== "function") {
            throw new Error("Reverser must be a function");
        }

        reverses.push(reverse);
        return this;
    };

    return Object.assign(reverser, {
        hasReversed: false,
        reverse() {
            for (let i = reverses.length - 1; i >= 0; i--) {
                if (typeof reverses[i] === "function") {
                    const r = reverses[i];
                    delete reverses[i];
                    r();
                }
            }

            this.hasReversed = true;
        }
    });
}