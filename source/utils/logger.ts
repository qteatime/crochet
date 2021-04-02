export class Logger {
  meta(level: string) {
    return `[${level}]`;
  }

  info(...xs: any[]) {
    console.log(this.meta("info"), ...xs);
  }

  debug(...xs: any[]) {
    console.debug(this.meta("debug"), ...xs);
  }

  error(...xs: any[]) {
    console.error(this.meta("error"), ...xs);
  }
}

export const logger = new Logger();
