/**
 * Handover Message Buffering + Reconnect Flush  —  SERVER HALF
 * -----------------------------------------------------------
 * A Cognigy Socket Endpoint Transformer that keeps a live-agent (handover)
 * conversation intact when the end user temporarily loses their websocket
 * connection — for example, they lock their phone, switch tabs, or drive
 * through a tunnel.
 *
 * The problem it solves:
 *   During a handover, messages from the human agent are pushed to the user
 *   via the Notify endpoint. If the user's websocket is disconnected at that
 *   moment, those messages are lost — the user reconnects and never sees them.
 *
 * The approach:
 *   1. Track the websocket connection state in sessionStorage using the
 *      built-in `user-connected` / `user-disconnected` events.
 *   2. On `user-disconnected` during a handover, send a `health-check` to any
 *      still-open sockets (the CLIENT half answers with `user-connected` if a
 *      tab is really still alive — see index.html). This avoids false
 *      buffering in multi-tab scenarios.
 *   3. While the user is disconnected AND in a handover, buffer any incoming
 *      agent messages (handleNotify) instead of dropping them.
 *   4. When the user reconnects, flush the buffered messages back into the
 *      conversation so the Flow can replay them in order.
 *
 * This is a genericized reference example. Replace the placeholder constants
 * below and adapt the event/data shape to your own handover integration.
 */

// Replace with your own endpoint domain and URL token so the transformer can
// call the Notify endpoint to emit the `health-check` message.
const COGNIGY_DOMAIN = "your-domain.cognigy.cloud";
const WEBCHAT_URL_TOKEN = "YOUR_ENDPOINT_URL_TOKEN";

createSocketTransformer({
  /**
   * handleInput runs on every message from the user, before the Flow.
   * We use it to react to websocket connect/disconnect events and to flush
   * buffered agent messages back into the conversation on reconnect.
   */
  handleInput: async ({ payload, endpoint }) => {
    let { userId, sessionId, text, data } = payload;
    data = data || {};

    const sessionStorage = await getSessionStorage(userId, sessionId);
    sessionStorage.bufferedMessages = sessionStorage.bufferedMessages ?? [];

    // Only the buffering machinery matters while we are in a handover.
    if (sessionStorage.handover) {
      const eventType = data?._cognigy?.event?.type;

      if (eventType === "user-connected") {
        // The user's websocket is back (or a live tab answered health-check).
        sessionStorage.webSocketConnected = true;

        const bufferedMessages = sessionStorage.bufferedMessages ?? [];
        if (bufferedMessages.length !== 0) {
          // Hand the buffered messages to the Flow so it can replay them to
          // the user in order (e.g. via a Say node loop).
          data.messagesToForward = bufferedMessages;
          data.event = "userConnected";

          // Rename `_cognigy` -> `cognigy` so this synthetic event is allowed
          // to reach the Flow. Cognigy blocks events under `_cognigy` from
          // triggering a Flow execution.
          data.cognigy = data._cognigy;
          delete data._cognigy;

          // Buffer has been handed off; clear it.
          sessionStorage.bufferedMessages = [];
        }
      } else if (eventType === "user-disconnected") {
        // A websocket dropped. Before we commit to buffering, ping any other
        // open sockets with a `health-check`. A still-open tab (see the CLIENT
        // half in index.html) will answer with `user-connected`, which cancels
        // buffering above. If nothing answers, buffering proceeds as intended.
        try {
          await httpRequest({
            uri: `https://endpoint-${COGNIGY_DOMAIN}/notify/${WEBCHAT_URL_TOKEN}`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            json: {
              userId,
              sessionId,
              text: "",
              data: { event: "health-check" },
              URLToken: WEBCHAT_URL_TOKEN,
            },
          });
        } catch (error) {
          console.error("Failed to send health-check: " + JSON.stringify(error));
        }

        sessionStorage.webSocketConnected = false;
        data.event = "userDisconnected";

        // Same rename trick so the Flow can react to the disconnect.
        data.cognigy = data._cognigy;
        delete data._cognigy;
      }
    }

    return { userId, sessionId, text, data };
  },

  /**
   * handleOutput runs on every message the Flow sends to the user.
   * We use it here only to keep the handover state flag in sync. Your Flow
   * signals handover start/stop by setting output.data.handover.
   */
  handleOutput: async ({ processedOutput, output, userId, sessionId }) => {
    const sessionStorage = await getSessionStorage(userId, sessionId);

    if (output?.data?.handover === true) {
      sessionStorage.handover = true;
      // Assume the socket is connected the moment handover starts.
      sessionStorage.webSocketConnected = true;
    } else if (output?.data?.handover === false) {
      sessionStorage.handover = false;
      sessionStorage.bufferedMessages = [];
    }

    return processedOutput;
  },

  /**
   * handleNotify runs when an external system (the live-agent platform) pushes
   * a message to the user via the Notify endpoint.
   *
   * This is where the buffering happens: if the user is disconnected during a
   * handover, we stash the message instead of letting it disappear.
   */
  handleNotify: async ({ request, response, endpoint }) => {
    const { userId, sessionId, text, data } = request.body;

    const sessionStorage = await getSessionStorage(userId, sessionId);
    sessionStorage.bufferedMessages = sessionStorage.bufferedMessages ?? [];

    // Identify messages that originate from the human agent. Adjust this check
    // to match how your integration tags agent-sourced messages.
    const isAgentMessage = data?.source === "agent" || data?.source === "automated";
    const inHandover = sessionStorage?.handover === true;

    // Agent messages outside a handover should never reach the user.
    if (isAgentMessage && !inHandover) {
      return; // block
    }

    // In a handover but the user's socket is down: buffer, don't deliver.
    if (isAgentMessage && sessionStorage.webSocketConnected === false) {
      sessionStorage.bufferedMessages.push(text);
      return; // block delivery; it will be flushed on reconnect
    }

    // Otherwise deliver as normal.
    return { userId, sessionId, text, data };
  },
});
