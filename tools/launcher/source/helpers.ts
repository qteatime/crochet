import * as Express from "express";

export async function trap<T>(res: Express.Response, x: () => Promise<T>) {
  try {
    return await x();
  } catch (e: any) {
    res.status(500).send(String(e));
  }
}
