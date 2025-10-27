# Vault App

Offline Vault App (Electron) — stores vault data locally and can sync JSON to Google Drive.

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Start the app (Electron):

```powershell
npm run start
```

## Notes
- Entry point: `main.js`.
- Renderer: `script.js` and `index.html`.
- `package.json` contains `start` and packaging scripts.
- `vaultData.json` is intentionally ignored to avoid pushing personal/local data.

## Pushing to GitHub
See the `How to push` section below for PowerShell commands to initialize, commit, create a remote, and push.
