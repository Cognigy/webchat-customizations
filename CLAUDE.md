# What this repository is
This repository is for examples on how to add custom functionality and design to the standard Cognigy Webchat.

## Design principles
- Use the other projects as an example for the structure of the app
- Prefer native CSS over external libraries unless otherwise noted
- Base changes on the other examples in this repository

## Functional requirements
- Every index.html file must include the source for for the webchat.js which is `  <script src="https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js"></script>
`
- It must also incluse an `initWebchat(ENDPOINT_URL)` function