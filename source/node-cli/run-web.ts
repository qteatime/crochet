import { app, BrowserWindow } from "electron";

const [config0] = process.argv.slice(2);
const config = JSON.parse(config0);

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: config?.config?.electron?.window?.width ?? 800,
    height: config?.config?.electron?.window?.height ?? 600,
    autoHideMenuBar: true,
    useContentSize: true,
  });

  mainWindow.loadURL(config.url);
}

app.whenReady().then(async () => {
  await createWindow();
});
