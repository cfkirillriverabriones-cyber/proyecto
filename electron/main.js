import { app, BrowserWindow } from 'electron';
import path from 'node:path';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#f4f6fa',
    webPreferences: { contextIsolation: true }
  });
  const url = process.env.ELECTRON_START_URL;
  if (url) win.loadURL(url);
  else win.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
};

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
