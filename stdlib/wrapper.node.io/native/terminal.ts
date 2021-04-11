import type { Plugin } from "../../../build/plugin";
import * as Rl from "readline";

export default async (plugin: Plugin) => {
  async function read(stream: NodeJS.ReadStream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  }

  async function readline(prompt: string) {
    const rl = Rl.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  plugin
    .define_ffi("terminal")
    .defun("clear", () => {
      console.clear();
      return plugin.nothing();
    })
    .defun("log-text", (text) => {
      console.log(plugin.get_text(text));
      return plugin.nothing();
    })
    .defun("log-error", (text) => {
      console.error(plugin.get_text(text));
      return plugin.nothing();
    })
    .defun("stdout-write", (text) => {
      process.stdout.write(plugin.get_text(text));
      return plugin.nothing();
    })
    .defun("stderr-write", (text) => {
      process.stderr.write(plugin.get_text(text));
      return plugin.nothing();
    })
    .defmachine("stdin-read", function* (_) {
      return plugin.from_js(yield plugin.await(read(process.stdin)));
    })
    .defmachine("read-line", function* (_, prompt) {
      return plugin.from_js(
        yield plugin.await(readline(plugin.get_text(prompt)))
      );
    });
};
