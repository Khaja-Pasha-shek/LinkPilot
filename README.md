# LinkPilot 🔗

![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)
![Chrome](https://img.shields.io/badge/browser-Chrome-brightgreen)
![Edge](https://img.shields.io/badge/browser-Edge-blue)
![Brave](https://img.shields.io/badge/browser-Brave-orange)

A productivity-focused Chrome extension that lets you assign and open saved URLs using keyboard shortcuts. Built with a polished UI, live search, and import/export options.

---

## Table of Contents

- [Description](#description)
- [Supported Browsers](#supported-browsers)
- [Features](#features)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Installation](#installation)
- [Build](#build)
- [Debugging](#debugging)
- [License](#license)

---

## Description

LinkPilot boosts your productivity by allowing you to instantly open saved links using hotkeys. Easily configure your preferred domains, manage settings in a modern UI, and sync across devices.

---

## Supported Browsers

- Chrome
- Edge
- Brave

---

## Features

- Assign keyboard shortcuts to open specific URLs
- Manage saved URLs (name, domain, shortcut)
- Import/export configuration as JSON
- UI with search bar, saved domain list, and about section
- Live filtering, persistent storage
- Automatically Fetch current tab domain name and its url

---

## Keyboard Shortcuts

- `Alt+O` — Open Extension Popup  
- `Alt+Shift+1` — Open Domain 1  
- `Alt+Shift+2` — Open Domain 2  
- `Alt+Shift+3` — Open Domain 3  
- `Alt+Shift+4` — Open Domain 4  

> **Note:** Shortcuts can be reassigned in `chrome://extensions/shortcuts`.

---

## Installation

> **Note:** Make sure your browser is up to date and Git is installed before proceeding.

1. Clone the repo:
   ```bash
   git clone https://github.com/Khaja-Pasha-shek/LinkPilot.git
   cd linkpilot
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer Mode** (top right)

4. Click **Load unpacked** and select the `dist` or `extension` folder (based on your build output)

---

## Build

```bash
chrome://extensions/
```

---

## Debugging

Open Developer Tools (`Ctrl+Shift+I`) inside the extension popup or background page. Use `debug.js` utilities for:

- Viewing or resetting saved data
- Testing shortcut commands manually
- Exporting storage to console

```bash
Ctrl+Shift+i for Windows
```
```bash
Cmd+Shift+i for Mac
```
---

## License

This project is licensed under the [GNU General Public License v3.0](./LICENSE).

---

> Built with ❤️ by **Shek Khaja Pasha** 🚀

