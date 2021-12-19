import type { ForeignInterface } from "../../../build/crochet";
import * as Rl from "readline";

async function read(stream: NodeJS.ReadStream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readline(prompt: string): Promise<string> {
  const rl = Rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export default (ffi: ForeignInterface) => {
  ffi.defun("terminal.clear", () => {
    console.clear();
    return ffi.nothing;
  });

  ffi.defun("terminal.log-text", (x) => {
    console.log(ffi.text_to_string(x));
    return ffi.nothing;
  });

  ffi.defun("terminal.log-error", (x) => {
    console.error(ffi.text_to_string(x));
    return ffi.nothing;
  });

  ffi.defun("terminal.stdout-write", (x) => {
    process.stdout.write(ffi.text_to_string(x));
    return ffi.nothing;
  });

  ffi.defun("terminal.stderr-write", (x) => {
    process.stderr.write(ffi.text_to_string(x));
    return ffi.nothing;
  });

  ffi.defmachine("terminal.stdin-read", function* () {
    const value = yield ffi.await(read(process.stdin).then((x) => ffi.text(x)));
    return value;
  });

  ffi.defmachine("terminal.read-line", function* (prompt0) {
    const prompt = ffi.text_to_string(prompt0);
    const value = yield ffi.await(
      readline(prompt).then((x) => ffi.untrusted_text(x))
    );
    return value;
  });
};
