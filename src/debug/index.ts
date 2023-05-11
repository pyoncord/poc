import Patcher from "@api/Patcher";

const { before } = new Patcher("debug-ws-patcher");
let websocket: WebSocket | null = null;

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

/**
 * Connects to the debugger.
 * @returns {Promise<void>} A promise that resolves when the FIRST connection is established
 */
export async function connectToDebugger(): Promise<void> {
    if (websocket) return;

    while (true) {
        try {
            websocket = new WebSocket("ws://localhost:9090/");
            break;
        } catch {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    websocket.addEventListener("open", () => console.log("Connected to debug websocket"));
    websocket.addEventListener("error", (e: any) => console.error(e.message));
    websocket.addEventListener("message", message => {
        try {
            const toEval = new AsyncFunction(`return (${message.data as string})`);
            toEval().then(console.log).catch(console.error);
        } catch (e) {
            console.error(e);
        }
    });

    websocket.addEventListener("close", () => {
        websocket = null;
        // ALways attempt to reconnect every 3 seconds
        setTimeout(connectToDebugger, 3000);
    });

    before(globalThis, "nativeLoggingHook", ([message, level]) => {
        if (websocket?.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({ level, message }));
        }
    });
}
