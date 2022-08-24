import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from "electron";
import * as Path from "path";

const [config0] = process.argv.slice(2);
const config = JSON.parse(config0);

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: config?.config?.electron?.window?.width ?? 800,
    height: config?.config?.electron?.window?.height ?? 600,
    webPreferences: {
      preload: Path.join(__dirname, "kernel.js"),
    },
    autoHideMenuBar: true,
  });

  ipcMain.handle("purr:get-config", () => {
    return config;
  });

  ipcMain.handle("purr:import-project-dialog", () => {
    return dialog.showOpenDialogSync({
      title: "Select a project to import",
      buttonLabel: "Import",
      filters: [{ name: "Crochet projects", extensions: ["json"] }],
      properties: ["openFile"],
    });
  });

  mainWindow.loadURL(config.url);
}

app.whenReady().then(async () => {
  await createWindow();
});
