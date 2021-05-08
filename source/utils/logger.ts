function force(x: any) {
  if (typeof x === "function") {
    return x();
  } else {
    return x;
  }
}

export class Logger {
  public verbose = false;

  meta(level: string) {
    return `[${level}]`;
  }

  info(...xs: any[]) {
    console.log(this.meta("info"), ...xs.map(force));
  }

  debug(...xs: any[]) {
    if (this.verbose) {
      console.debug(this.meta("debug"), ...xs.map(force));
    }
  }

  error(...xs: any[]) {
    console.error(this.meta("error"), ...xs.map(force));
  }
}

export const logger = new Logger();
