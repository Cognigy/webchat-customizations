# Webchat Customizations

# Introduction
This repository contains examples of HTML, CSS and Javascript code to change the look and functionality of the standard Cognigy Webchat. 

## Overview

This repository contains code for [Cognigy Webchat customization]([https://docs.cognigy.com/docs/transformers](https://docs.cognigy.com/webchat/v3/configuration) which can be used as blueprints for further developments. Therefore, all of them are provided under the [MIT license](./LICENSE).

**Important:** \
Please note, that Cogngiy does not provide enterprise support for developed customizations. This repository is licensed under MIT, in which the community is responsible for the shared functions. If you found a bug or want to improve yet developed functionalities, please don't hesitate to create a branch.

## Installation

1. In an HTML file copy and paste the complete code.
2. Replace `REPLACE_WITH_YOUR_ENDPOINT` on the `initWebchat(...)` line with your Cognigy endpoint URL.
3. Host the file (any static host or your existing site).

---

### Create a new customization or fix a bug

In order to create a new webchat customization, please create a new feature branch:

- `git checkout -b feature/<your-feature>`

If you want to fix an existing one, please create a bug branch:

- `git checkout -b bug/<module-name>`