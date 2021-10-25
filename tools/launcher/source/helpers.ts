import * as Express from "express";
import * as ChildProcess from "child_process";
import * as FS from "fs";
import * as Path from "path";
import * as OS from "os";

export async function trap<T>(res: Express.Response, x: () => Promise<T>) {
  try {
    return await x();
  } catch (e: any) {
    res.status(500).send(String(e));
  }
}

export function open_directory(path: string) {
  if (is_windows() || is_wsl()) {
    const real_path = translate_wsl_path(path);
    ChildProcess.execFileSync("powershell.exe", [
      "start",
      "explorer.exe",
      real_path,
    ]);
  } else if (is_osx()) {
    ChildProcess.execFileSync("open", [path]);
  } else {
    ChildProcess.execFileSync("xdg-open", [path]);
  }
}

function is_windows() {
  return OS.platform() === "win32";
}

function is_wsl() {
  return OS.platform() === "linux" && /-microsoft-/.test(OS.release());
}

function is_osx() {
  return OS.platform() === "darwin";
}

function translate_wsl_path(path: string) {
  if (is_wsl()) {
    const real_path = ChildProcess.execFileSync("wslpath", [
      "-w",
      path,
    ]).toString("utf-8");
    return real_path.trim();
  } else {
    return path;
  }
}

export function launch_code_editor(path: string) {
  if (is_windows()) {
    ChildProcess.execFileSync("code.cmd", [path]);
  } else {
    ChildProcess.execFileSync("code", [path]);
  }
}

export type Deferred<T> = {
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  promise: Promise<T>;
};

export function defer<T>() {
  const deferred: Deferred<T> = Object.create(null);
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
