import { contextBridge, ipcRenderer } from "electron";
import * as Crypto from "crypto";

const configp = ipcRenderer.invoke("purr:get-config");
