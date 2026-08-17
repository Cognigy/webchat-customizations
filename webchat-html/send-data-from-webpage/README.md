# Send Data from Webpage

A Cognigy Webchat customization that passes context from the hosting page —
such as the current URL path and the page/browser language — to the bot at the
start of the conversation.

## Overview

When the webchat starts, it attaches a data object to the initial
`GET_STARTED` message. Anything you put in that object arrives in Cognigy as
`input.data.<key>` on the first message, so the flow can branch on where the
chat was opened, prime itself in the right language, or use any other page
context you provide.

This example bundles two common cases into one — **URL pass-through** and
**language pass-through** — but the same mechanism works for any value you can
read from the page.

## Features

- **URL pass-through**: Sends `window.location.pathname` so the flow knows
  which page the chat was opened on.
- **Language pass-through**: Detects the browser language and normalizes it to
  a locale your flow expects.
- **Extensible**: Add any additional page context to a single `getStartedData`
  object.

## How It Works

1. On load, the page reads its own context (`window.location.pathname`,
   `navigator.language`, and anything else you add).
2. The language string is normalized to a locale the flow understands.
3. The values are placed in a `getStartedData` object and passed to
   `initWebchat` via `settings`.
4. The Webchat attaches `getStartedData` to the initial `GET_STARTED` message,
   where it arrives in Cognigy as `input.data.url`, `input.data.language`, etc.

## Configuration

Adjust the language normalization to match the locales your flow supports:

```javascript
let language = navigator.language || navigator.userLanguage || "en-US";
if (language.startsWith("nl")) {
  language = "nl-NL";
} else {
  language = "en-GB";
}
```

Add any other page context you want to send in the `getStartedData` object:

```javascript
const getStartedData = {
  url: window.location.pathname,
  language: language,
  // customField: "...",
};
```

## From the Bot

Read the passed-through values in your flow via the `input.data` object:

- `input.data.url` — the page path the chat was opened on (e.g. in a Lookup
  node to start the conversation differently per page).
- `input.data.language` — the detected locale (e.g. `"nl-NL"` or `"en-GB"`) to
  prime the flow's localization.

These values are also available for analytics/reporting.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not arriving in the flow | Confirm you're reading `input.data.<key>` on the **first** message of the session |
| Wrong language sent | Adjust the normalization mapping to cover the visitor's browser language |
| URL is empty or unexpected | `window.location.pathname` reflects the page hosting the webchat; verify the embed location |

## Notes
- This example sends `window.location.pathname`, so the bot receives a relative URL path (no protocol/host).
- See `index.html` in this folder for the full, working reference implementation.