"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    loadVaultData: () => electron_1.ipcRenderer.invoke('load-vault-data'),
    saveVaultData: (data) => electron_1.ipcRenderer.invoke('save-vault-data', data),
    openExternal: (url) => {
        electron_1.ipcRenderer.invoke('open-external', url);
    }
});
