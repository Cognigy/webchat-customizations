# Handover Message Buffering + Reconnect Flush

A Cognigy Webchat customization that prevents live-agent (handover) messages from being lost when the end user temporarily loses their websocket connection — for example, they lock their phone, switch to another app, or drive through a tunnel.

## Overview

During a handover, messages from the human agent are pushed to the user through the Notify endpoint. If the user's websocket happens to be disconnected at that moment, those messages simply vanish — the user reconnects and never sees what the agent said.

This example buffers agent messages on the server while the user is away and **replays them in order** the moment the user reconnects. It also includes a multi-tab safeguard so a user with two open tabs doesn't trigger false buffering.

Unlike the other examples in this repository, this feature has **two halves** that work together:

| File | Runs where | Responsibility |
|------|-----------|----------------|
| `index.html` | Browser (client) | Answers the transformer's `health-check` so a still-open tab isn't mistaken for a disconnected user. |
| `transformer.js` | Cognigy Socket Endpoint Transformer (server) | Tracks connection state, buffers agent messages while disconnected, flushes them on reconnect. |

## How It Works

### Connection tracking

Cognigy emits `user-connected` and `user-disconnected` events as websockets open and close. The transformer (`index.js`) listens for these in `handleInput` and stores the current state in `sessionStorage.webSocketConnected`.

### Buffering

When an agent message arrives at the Notify endpoint (`handleNotify`) during a handover **and** `webSocketConnected` is `false`, the message text is pushed onto `sessionStorage.bufferedMessages` instead of being delivered. Delivery is blocked by returning early.

### Flushing on reconnect

When the user reconnects, `handleInput` sees a `user-connected` event. If there are buffered messages, it attaches them to `data.messagesToForward` and sets `data.event = "userConnected"`, then hands control to the Flow, which replays them to the user (for example, via a Say node loop).

### The multi-tab `health-check` handshake

Cognigy fires `user-disconnected` whenever **any** socket closes. If a user has two tabs open and closes one, the transformer would wrongly conclude the user is gone and start buffering — so the still-open tab would stop receiving agent messages.

To avoid this, on `user-disconnected` the transformer first sends a `health-check` message to all open sockets. The client (`index.html`) replies with a synthetic `user-connected`:

```js
if (data.event === "health-check") {
  webchat.sendMessage("", { _cognigy: { event: { type: "user-connected" } } });
}
```

- If a tab is still alive, that `user-connected` reaches the transformer and cancels buffering.
- If every tab was really closed, nothing answers, so buffering proceeds as intended.

## The `_cognigy` → `cognigy` rename

Events nested under `data._cognigy` are treated by Cognigy as internal and are **not** allowed to trigger a Flow execution. When the transformer needs a synthetic event (like `userConnected` / `userDisconnected`) to actually reach the Flow, it copies the object to `data.cognigy` and deletes `data._cognigy`. You will see this pattern in `handleInput`.

## Configuration

**Client (`index.html`):**

| Constant | Description |
|----------|-------------|
| `ENDPOINT_URL` | Your Cognigy Webchat endpoint URL. |

**Server (`index.js`):**

| Constant | Description |
|----------|-------------|
| `COGNIGY_DOMAIN` | Your Cognigy endpoint domain, used to build the Notify URL for the `health-check`. |
| `WEBCHAT_URL_TOKEN` | The endpoint's URL token. |

> These are placeholders. Replace them with your own values before deploying. Never commit real tokens.

## Handling It in Your Flow

Your Flow is responsible for two things this example expects:

1. **Signalling handover state** by setting `output.data.handover` to `true` when a handover starts and `false` when it ends. The transformer reads this in `handleOutput` to know when buffering applies.
2. **Replaying buffered messages** when it receives an input with `data.event === "userConnected"`. The buffered texts arrive in `data.messagesToForward` (an array, in order) — loop over them and Say each one.

## Usage

1. Deploy `index.js` as the **Transformer** on your Cognigy Socket Endpoint.
2. Host `index.html` (replacing `ENDPOINT_URL`) as the page that embeds the Webchat, or copy its `registerAnalyticsService(...)` handler into your existing Webchat host page.
3. In your Flow, set `data.handover` on handover start/end and handle the `userConnected` event to replay `data.messagesToForward`.

## Adapting It

- **Agent-message detection** — `handleNotify` identifies agent messages via `data.source === "agent" || "automated"`. Change this to match how your live-agent platform tags its messages.
- **What gets buffered** — this example buffers only the message `text`. If you need to preserve attachments or metadata, buffer the whole payload instead of just the string.

## Notes

- Buffering and connection state live in `sessionStorage`, so they are scoped per user + session and survive across the individual socket connect/disconnect cycles.
- The buffer is cleared when the handover ends (`data.handover === false`) and after a successful flush, so stale messages are never replayed into a later conversation.
