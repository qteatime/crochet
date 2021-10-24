import { app, BrowserWindow } from "electron";
import * as Launcher from "./launcher";
import * as Path from "path";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.removeMenu();
  mainWindow.loadURL("http://localhost:8000/");
}

async function main() {
  await app.whenReady();
  await Launcher.start_servers(8000);
  createWindow();
}

app.on("window-all-closed", function () {
  app.quit();
});

main().catch((e) => {
  console.error(e.stack ?? e);
  process.exit(1);
});
