# Inactivity Timer

A Cognigy Webchat customization that detects when a user has stopped interacting and notifies the Flow, so it can react to abandoned conversations.

## Overview

This customization starts a countdown after each message the user sends. If the user does not send another message before the timeout elapses, a special event is dispatched into the Flow. Your Flow can then handle this event however you like — for example, sending a "Are you still there?" prompt, ending the conversation, or triggering a handover.

## How It Works

The customization hooks into the Webchat's analytics service to observe events:

1. When the user sends an outgoing message (that is not itself an inactivity event), the inactivity timer is reset via `resetTimer()`.
2. If `INACTIVITY_TIMEOUT` milliseconds pass with no new user message, `timeout()` runs and calls:

   ```js
   cognigyWebchat.sendMessage('', { inactivityTimeout: true });
   ```

   This sends an empty message carrying `inactivityTimeout: true` in its data, which your Flow can branch on.

## Configuration

Two constants at the top of the `<script>` block control the behavior:

| Constant | Description | Default |
|----------|-------------|---------|
| `INACTIVITY_TIMEOUT` | Milliseconds of inactivity before the timeout event fires | `5 * 1000` (5 seconds) |

> **Note:** The default of 5 seconds is intentionally short for demonstration. Raise it to a realistic value (e.g. `2 * 60 * 1000` for 2 minutes) before deploying.

## Handling the Event in Your Flow

The inactivity event arrives as a user input with `input.data.inactivityTimeout === true`. Use a condition (e.g. a Lookup or If node) to branch on it and decide what the bot should do next.

## Usage

`index.html` is a **complete, standalone Webchat host page** — not a script you include into an existing page. It loads `webchat.js`, initializes the Webchat, and adds the inactivity-timer logic itself.

To use it:

1. Open `index.html` and replace `ENDPOINT_URL` with your own Cognigy Webchat endpoint.
2. Adjust `INACTIVITY_TIMEOUT` to a production-appropriate value.
3. Serve the file (or its contents) as the page that hosts your Webchat.

To add this behavior to an **existing** Webchat page instead, copy the timer logic and the `registerAnalyticsService(...)` handler from the `<script>` block into your own `initWebchat(...).then(...)` callback.

## Example Setup

The core structure of the host page looks like this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <script src="https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js"></script>
  <script>
    const ENDPOINT_URL = "https://your-endpoint.cognigy.ai/...";
    const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes

    // timer logic + initWebchat(...) with the analytics handler go here
  </script>
</body>
</html>
```

See `index.html` in this folder for the full, working reference implementation.

## Browser Console

When the timeout fires, a message is logged:

```
User has been inactive for more than <N> seconds. Sending the inactivity timeout event to the flow
```