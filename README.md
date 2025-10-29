# Vault App

Offline Vault App (Electron + React + TypeScript) — stores vault data locally and can sync JSON to Google Drive.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 25
- **Build**: Webpack 5 + Babel
- **Testing**: Jest + React Testing Library
- **Styling**: CSS (migrated from original styles)

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Development mode:

```bash
# Start webpack dev server + Electron
npm run electron-dev

# Or start dev server only
npm run dev
```

3. Production mode:

```bash
# Build and start Electron app
npm run electron-pack

# Or just build React app
npm run build
```

4. Create executables:

**macOS:**

```bash
npm run package-mac
```

**Windows:**

```bash
npm run package-win
```

5. Run tests:

```bash
npm test
```

## Project Structure

```
├── src/                     # React + TypeScript source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application
├── public/                # Static assets
├── electron/              # Electron preload scripts
├── dist/                  # Production build output
├── __tests__/             # TypeScript tests
└── main.js               # Electron main process
```

## Features

- **POE2 Unique Items Management**: Track your unique item collection
- **Metrics Dashboard**: View completion statistics by league/category
- **Advanced Filtering**: Filter by league, bosses, special conditions
- **Search Functionality**: Find items by name, category, or obtain method
- **Item Management**: Add, edit, delete items with full form validation
- **Visual Organization**: Items grouped by category with completion percentages
- **Offline Storage**: Local JSON file with Google Drive sync capability
- **Cross-Platform**: Works on macOS and Windows

## Migration

This project was successfully migrated from vanilla JavaScript to React + TypeScript. See [MIGRATION.md](./MIGRATION.md) for detailed information about the migration process and technical improvements.

## Notes

- Entry point: `main.js` (Electron main process)
- React app: `src/index.tsx` and `src/App.tsx`
- Production build: `dist/` directory
- `vaultData.json` is intentionally ignored to avoid pushing personal/local data
- All original functionality preserved with enhanced type safety and modern architecture
