import Patcher from "@api/Patcher";

const { before } = new Patcher("debug-ws-patcher");
const patcher = new Patcher("ws-patcher");

let websocket: WebSocket | null = null;

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

/**
 * Connects to the debugger.
 */
export function connectToDebugger() {
    if (websocket) return;

    websocket = new WebSocket("ws://localhost:9090/");

    const toExpose = {
        ...pyoncord.metro,
        ...pyoncord.utils,
        patcher
    };

    const [exposeKeys, exposeValues] = [Object.keys(toExpose), Object.values(toExpose)];

    websocket.addEventListener("open", () => console.log("Connected to debug websocket"));
    websocket.addEventListener("error", (e: any) => console.error(e.message));
    websocket.addEventListener("message", message => {
        try {
            const toEval = new AsyncFunction(...exposeKeys, `return (${message.data as string})`);
            toEval(...exposeValues).then(console.log).catch(console.error);
        } catch (e) {
            console.error(e);
        }
    });

    const unpatch = before(globalThis, "nativeLoggingHook", ([message, level]) => {
        if (websocket?.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({ level, message }));
        }
    });

    websocket.addEventListener("close", () => {
        unpatch();
        websocket = null;
        // Always attempt to reconnect every 3 seconds
        setTimeout(connectToDebugger, 3000);
    });
}
