# Language Flag Dropdown

![Language flag dropdown in the webchat header](assets/example-flag-dropdown%20.png)

A Cognigy Webchat customization that adds a flag-based language selector to the webchat header bar, letting users switch the conversation language on the fly.

## Overview

The customization detects the visitor's browser language on load, tells the bot which language to use, and injects a hover dropdown of flag icons into the header bar. Selecting a flag sends a `changeLanguage` message to the bot and swaps the header flag icon to the chosen language.

## Features

- **Auto-detection**: Reads `navigator.language` and maps it to a supported locale (`en-US` / `de-DE`), defaulting to `en-US`.
- **In-header selector**: A flag dropdown is added to the webchat header bar.
- **Bot notification**: Language changes are sent to the bot via a `changeLanguage` message.
- **Dynamic icon**: The header flag updates to reflect the active language.

## How It Works

1. On load, the browser language is normalized to `en-US` or `de-DE`. This can be adjusted based on your needs.
2. The detected language is passed to the bot in `settings.getStartedData.language`.
3. A `MutationObserver` waits for the header bar to render, then injects the dropdown button once.
4. Clicking a flag calls `changeLanguage(locale)`, which sends `{ changeLanguage: true, language: locale }` to the bot and updates the header icon.

## Flag Assets

The dropdown references SVG flags from a `./flags/` folder relative to this file:

```
flags/
  en-US.svg
  de-DE.svg
```

Add one SVG per supported locale. To support more languages, add another `<a data-language="…" onclick='return changeLanguage("…")'>` entry in the dropdown and extend the detection logic.


### From the Bot

Handle the incoming `changeLanguage` flag in your flow to switch the conversation language:

```json
{
  "changeLanguage": true,
  "language": "de-DE"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Flags don't show | Ensure the `./flags/*.svg` files exist and paths are correct |
| Dropdown not injected | Verify the webchat renders a `.webchat-header-bar` element |
| Language not changing | Confirm the bot handles the `changeLanguage` payload |