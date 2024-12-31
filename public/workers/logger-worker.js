/// <reference lib="webworker" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = process.env.NEXT_PUBLIC_LOGGER_URL || "https://log.bones.sh/v1";
/**
 * Logger Worker
 * This worker handles logging operations in batches to reduce API calls.
 */
const logQueue = [];
const MAX_BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds
const flushLogs = () => {
    if (logQueue.length === 0) {
        return;
    }
    const logsToSend = logQueue.splice(0, MAX_BATCH_SIZE);
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logsToSend),
    })
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Logs sent:", response.statusText, response);
    }))
        .catch((error) => console.error("Error sending logs:", error));
    console.log("Flushed logs:", logsToSend);
};
setInterval(flushLogs, FLUSH_INTERVAL);
self.addEventListener("message", (event) => {
    const { logData } = event.data;
    logQueue.push(logData);
    flushLogs();
    if (logQueue.length >= MAX_BATCH_SIZE) {
        flushLogs();
    }
});
//# sourceMappingURL=logger-worker.js.map