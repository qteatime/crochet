import { app, BrowserWindow, ipcMain, Menu, MenuItem } from "electron";
import * as REPL from "../node-repl";
import * as Path from "path";
import { string } from "../utils/spec";

const [config0] = process.argv.slice(2);
const config = JSON.parse(config0);

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: config?.screen_dimension?.width ?? 800,
    height: config?.screen_dimension?.height ?? 600,
    webPreferences: {
      preload: Path.join(__dirname, "playground-kernel.js"),
    },
    autoHideMenuBar: true,
  });

  ipcMain.handle("playground:get-config", () => {
    return config;
  });

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Playground",
      submenu: [
        {
          label: "Reload playground",
          accelerator: "F5",
          click: () => mainWindow.reload(),
        },
        {
          label: "Open DevTools",
          accelerator: "F12",
          click: () => mainWindow.webContents.openDevTools(),
        },
        {
          label: "Quit",
          accelerator: "Alt+F4",
          click: () => app.quit(),
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
  mainWindow.loadURL(config.url);
}

app.whenReady().then(async () => {
  await createWindow();
});
