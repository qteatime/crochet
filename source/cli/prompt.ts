import * as Rl from "readline";

export async function readline(prompt: string): Promise<string> {
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

export async function question(prompt: string): Promise<boolean> {
  const answer = (await readline(prompt)).trim().toLowerCase();
  return answer === "yes" || answer === "y";
}
